pipeline {
  agent any

  environment {
    NODE_ENV = 'development'
  }

  stages {
    stage('Clone Repo') {
      steps {
        git branch: 'main', url: 'https://github.com/YohannesTsegaye/smart.git'
      }
    }

    stage('Install Frontend') {
      steps {
        dir('frontend') {
          // Optional: remove old node_modules to avoid cache issues
          sh 'rm -rf node_modules package-lock.json'
          sh 'npm install'
        }
      }
    }

    stage('Build Frontend') {
      steps {
        dir('frontend') {
          sh 'npm run build'
        }
      }
    }

    stage('Start Frontend') {
      steps {
        dir('frontend') {
          sh 'npm start'
        }
      }
    }
  }

  post {
    failure {
      echo "❌ Frontend build failed! Check logs above."
    }
    success {
      echo "✅ Frontend build and start completed successfully!"
    }
  }
}
