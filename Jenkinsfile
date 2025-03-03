pipeline {
    agent any
    
    tools {
        nodejs "NodeJS 20"  // Use the name you configured in Jenkins
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Install dependencies') {
            steps {
                sh 'npm install'
            }
        }
        
        stage('Run tests') {
            steps {
                sh 'npm test'
            }
        }
        
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
        
        stage('Deploy') {
            steps {
                // Add your deployment commands here
                // For example, to deploy to a remote server:
                // sh 'scp -r dist/* user@your-server:/path/to/deployment'
                echo 'Deployment step will go here'
            }
        }
    }
}