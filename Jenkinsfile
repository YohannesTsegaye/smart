pipeline {
  agent any

  environment {
    NODE_ENV = 'development'
  }

  stages {
    stage('Clone Repo') {
      steps {
        git 'https://github.com/YohannesTsegaye/smart.git'
      }
    }

    stage('Install Frontend') {
      steps {
        dir('frontend') {
sh ' cd frontend'
          sh 'npm install'
        }
      }
    }

    stage('Build Frontend') {
      steps {
        dir('frontend') {
sh ' cd frontend'
          sh 'npm run build'
        }
      }
    }

    stage('Install Backend') {
      steps {
        dir('backend') {
sh ' cd backend'
          sh 'npm install'
        }
      }
    }

    stage('Build Backend') {
      steps {
        dir('backend') {
sh ' cd backend'
          sh 'npm run build'
        }
      }
    }

    stage('Test Backend') {
      steps {
        dir('backend') {
sh ' cd backend'
          sh 'npm run test'
        }
      }
    }
stage('start backend') {
      steps {
        dir('backend') {
sh ' cd backend'
          sh 'npm run start'
        }
      }
    }
stage('start frontend') {
      steps {
        dir('frontend') {
sh ' cd frontend'
          sh 'npm start'
        }
      }
    }

  }

  post {
    failure {
      echo "Build failed! Checkerrors above."
    }
    success {
      echo "Build completed successfully!"
    }
  }
}

