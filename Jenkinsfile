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
     stage('Test frontend'){
      steps{
        dir('frontend'){
          sh'npm run test'
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
