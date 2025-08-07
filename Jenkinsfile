pipeline {
  agent any

  environment {
    NODE_ENV = 'development'
  }
 

  stages {
    stage('Clone Repo') {
      steps {
<<<<<<< HEAD:Jenkinsfile
        git branch: 'main', url: 'https://github.com/YohannesTsegaye/smart.git'
=======
       git branch: 'main', url: 'https://github.com/YohannesTsegaye/smart.git'

>>>>>>> 7cfdd01 (Fix: Add missing @tanstack/react-query dependency):jenkinsfile
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
<<<<<<< HEAD:Jenkinsfile

    stage('Start Backend') {
      steps {
        dir('backend') {
=======
stage('start backend') {
      steps {
        dir('backend') {
sh ' cd backend'
>>>>>>> 7cfdd01 (Fix: Add missing @tanstack/react-query dependency):jenkinsfile
          sh 'npm run start'
        }
      }
    }
<<<<<<< HEAD:Jenkinsfile

    stage('Start Frontend') {
      steps {
        dir('frontend') {
=======
stage('start frontend') {
      steps {
        dir('frontend') {
sh ' cd frontend'
>>>>>>> 7cfdd01 (Fix: Add missing @tanstack/react-query dependency):jenkinsfile
          sh 'npm start'
        }
      }
    }
<<<<<<< HEAD:Jenkinsfile
=======

>>>>>>> 7cfdd01 (Fix: Add missing @tanstack/react-query dependency):jenkinsfile
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


