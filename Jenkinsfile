pipeline {
  agent any

  environment {
    NODE_ENV = 'development'
  }
  tools {
    nodejs "Node 18" // Use the NodeJS installed from Global Tool Config
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

    stage('Install Backend') {
      steps {
        dir('backend') {
          sh 'npm install'
        }
      }
    }

    stage('Build Backend') {
      steps {
        dir('backend') {
          sh 'npm run build'
        }
      }
    }

    stage('Test Backend') {
      steps {
        dir('backend') {
          sh 'npm run test'
        }
      }
    }

    stage('Start Backend') {
      steps {
        dir('backend') {
          sh 'npm run start'
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
      echo "Build failed! Check errors above."
    }
    success {
      echo "Build completed successfully!"
    }
  }
}

