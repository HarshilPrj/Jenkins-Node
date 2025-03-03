pipeline {
    agent any

    tools {
        nodejs "NodeJS 20" // Use the name you configured in Jenkins
    }

    stages {
        stage('Checkout') {
            steps {
                echo "Application Process Started...."
                checkout scm
            }
        }

        stage('Install dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run Start') {
            steps {
                sh 'npm run dev'
            }
        }

        stage('Completion') {
          steps {
            echo "Application Process Completed...."
          }
        }
    }
}