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
                    // Verify Node.js and npm are available
                    def nodeVersion = sh(script: 'node --version', returnStdout: true).trim()
                    def npmVersion = sh(script: 'npm --version', returnStdout: true).trim()
                    echo "ℹ️ Using Node.js ${nodeVersion} and npm ${npmVersion}"
                    
                    // Checkout code
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
                    // Clean previous installation
                    sh 'rm -rf node_modules'
                    
                    // Strategy 1: Generate package-lock.json if missing
                    if (!fileExists('package-lock.json')) {
                        echo "ℹ️ No package-lock.json found, generating one..."
                        sh 'npm install --package-lock-only --no-audit'
                    }
                    
                    // Strategy 2: Install using package-lock.json
                    try {
                        sh 'npm ci --no-audit'
                        echo "✅ Dependencies installed via npm ci"
                    } catch (ciErr) {
                        echo "⚠️ npm ci failed, falling back to npm install"
                        
                        // Strategy 3: Regular install with devDependencies
                        try {
                            sh 'npm install --no-audit --include=dev'
                            echo "✅ Dependencies installed via npm install"
                        } catch (installErr) {
                            echo "⚠️ Regular install failed, trying per-package install"
                            
                            // Strategy 4: Install critical packages individually
                            sh 'npm install eslint vite --save-dev --no-audit'
                        }
                    }
                    
                    // Final verification
                    def verifyDependency = { dep ->
                        return sh(
                            script: "npm list ${dep} --depth=0 --parseable=true",
                            returnStatus: true
                        ) == 0
                    }
                    
                    if (!verifyDependency('eslint') || !verifyDependency('vite')) {
                        error("❌ Critical dependencies (eslint/vite) could not be installed")
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
                        echo "⚠️ Linting issues found (not blocking build)"
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
