pipeline {
    agent any

    environment {
        NODE_ENV = 'production'
        VITE_API_URL = 'http://localhost:3000'
        NPM_CONFIG_REGISTRY = 'https://registry.npmjs.org'
    }

    stages {
        stage('🏗️ 1. Checkout & Setup') {
            steps {
                cleanWs()
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/main']],
                    userRemoteConfigs: [[
                        url: 'https://github.com/YohannesTsegaye/smart-recruit-frontend.git',
                        credentialsId: 'github-credentials'
                    ]]
                ])
                echo "✅ Repository cloned successfully"
                
                sh 'node --version'
                sh 'npm --version'
            }
        }

        stage('📦 2. Install Dependencies') {
            steps {
                script {
                    // Clean existing installation
                    sh 'rm -rf node_modules'
                    
                    // Strategy 1: Try normal install first
                    try {
                        sh 'npm install --no-audit --prefer-offline'
                        echo "✅ Initial npm install completed"
                    } catch (err) {
                        echo "⚠️ Initial install failed, trying with network refresh"
                        sh 'npm install --no-audit --prefer-offline --fetch-timeout=60000'
                    }
                    
                    // Verify critical dependencies are actually installed
                    def verifyInstall = { dep ->
                        return sh(script: "npm list ${dep} --depth=0 --parseable", returnStatus: true) == 0
                    }
                    
                    // List of critical devDependencies to verify
                    def criticalDeps = ['eslint', 'vite']
                    def missingDeps = criticalDeps.findAll { !verifyInstall(it) }
                    
                    if (missingDeps) {
                        echo "⚠️ Missing critical dependencies: ${missingDeps}"
                        
                        // Strategy 2: Explicitly install missing packages
                        sh "npm install ${missingDeps.join(' ')} --save-dev --no-audit --prefer-offline"
                        
                        // Final verification
                        missingDeps = criticalDeps.findAll { !verifyInstall(it) }
                        if (missingDeps) {
                            // Strategy 3: Nuclear option - clean everything and reinstall
                            echo "⚠️ Critical dependencies still missing, performing clean install"
                            sh 'rm -rf node_modules package-lock.json'
                            sh 'npm install --no-audit --prefer-offline'
                            
                            // Final check
                            missingDeps = criticalDeps.findAll { !verifyInstall(it) }
                            if (missingDeps) {
                                error("❌ Failed to install critical dependencies: ${missingDeps}")
                            }
                        }
                    }
                    
                    echo "✅ Verified all critical dependencies: ${criticalDeps}"
                }
            }
        }

        stage('🧹 3. Lint Code') {
            steps {
                script {
                    try {
                        sh 'npx eslint --version'
                        sh 'npx eslint .'
                        echo "✅ Linting passed"
                    } catch (err) {
                        echo "⚠️ Linting issues found (not blocking)"
                    }
                }
            }
        }

        stage('🏗️ 5. Build Project') {
            steps {
                script {
                    sh 'npx vite --version'
                    sh 'npx vite build'
                    echo "✅ Build completed successfully"
                    sh 'du -sh dist/'
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
            echo "✅ Pipeline succeeded!"
        }
        failure {
            echo "❌ Pipeline failed"
        }
    }
}
