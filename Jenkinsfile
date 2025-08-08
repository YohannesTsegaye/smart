pipeline {
    agent any

    environment {
        NODE_ENV = 'production'
        VITE_API_URL = 'http://localhost:3000'
        NPM_CONFIG_REGISTRY = 'https://registry.npmjs.org'
    }

    stages {
        stage('🚀 1. Environment Setup') {
            steps {
                cleanWs()
                script {
                    // Verify Node.js and npm versions
                    def nodeVersion = sh(script: 'node --version', returnStdout: true).trim()
                    def npmVersion = sh(script: 'npm --version', returnStdout: true).trim()
                    echo "ℹ️ Using Node.js ${nodeVersion} and npm ${npmVersion}"

                    // Checkout code from main branch
                    checkout([
                        $class: 'GitSCM',
                        branches: [[name: '*/main']],
                        userRemoteConfigs: [[
                            url: 'https://github.com/YohannesTsegaye/smart-recruit-frontend.git',
                            credentialsId: 'github-credentials'
                        ]]
                    ])
                    echo "✅ Repository cloned successfully"
                }
            }
        }

        stage('📦 2. Dependency Installation') {
            steps {
                script {
                    // Remove node_modules but keep package-lock.json if present
                    sh 'rm -rf node_modules'

                    // Create package-lock.json if missing
                    if (!fileExists('package-lock.json')) {
                        echo "ℹ️ No package-lock.json found, generating..."
                        sh 'npm install --package-lock-only --no-audit'
                    }

                    // Try clean install first
                    try {
                        sh 'npm ci --no-audit'
                        echo "✅ Dependencies installed via npm ci"
                    } catch (ciErr) {
                        echo "⚠️ npm ci failed, falling back to npm install"
                        sh 'npm install --no-audit --include=dev'
                    }

                    // Ensure critical dev dependencies
                    def depsToEnsure = ['eslint', 'vite']
                    depsToEnsure.each { dep ->
                        if (sh(script: "npm list ${dep} --depth=0 --parseable", returnStatus: true) != 0) {
                            echo "ℹ️ Installing missing dependency: ${dep}"
                            sh "npm install ${dep} --save-dev --no-audit"
                        }
                    }

                    // Final verification
                    depsToEnsure.each { dep ->
                        if (sh(script: "npm list ${dep} --depth=0 --parseable", returnStatus: true) != 0) {
                            error("❌ Critical dependency missing: ${dep}")
                        }
                    }

                    echo "✅ Verified all critical dependencies"
                }
            }
        }

        stage('🧹 3. Linting') {
            steps {
                script {
                    try {
                        sh 'npx eslint --version'
                        sh 'npx eslint . --max-warnings=0'
                        echo "✅ Linting passed with no warnings"
                    } catch (err) {
                        echo "⚠️ Linting issues found (build continues)"
                    }
                }
            }
        }

        stage('🏗️ 4. Building') {
            steps {
                script {
                    sh 'npx vite --version'
                    sh 'npx vite build --emptyOutDir'
                    echo "✅ Build completed successfully"

                    // Verify build output
                    def buildDir = fileExists('dist') ? 'dist' : 'build'
                    sh "ls -la ${buildDir}/"
                    echo "📦 Build output size:"
                    sh "du -sh ${buildDir}/"
                }
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'dist/**/*', allowEmptyArchive: true
            cleanWs()
        }
        success {
            echo "🎉 Pipeline succeeded!"
        }
        failure {
            echo "❌ Pipeline failed"
        }
    }
}
