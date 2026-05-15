pipeline {
    agent any

    environment {
        DOCKERHUB_USERNAME = 'salmahesham1114'
        REPO_NAME = 'fullstack-demo-project'

        BACKEND_IMAGE = "${DOCKERHUB_USERNAME}/${REPO_NAME}:backend-${BUILD_NUMBER}"
        FRONTEND_IMAGE = "${DOCKERHUB_USERNAME}/${REPO_NAME}:frontend-${BUILD_NUMBER}"
    }

    stages {

        stage('Checkout Code from GitHub') {
            steps {
                git branch: 'main',
                    url: 'git@github.com:Salmaa-Hesham/fullstack-demo-project.git'
            }
        }

        stage('Build Backend Docker Image') {
            steps {
                sh '''
                    echo "Building backend Docker image..."
                    docker build -t $BACKEND_IMAGE -f backend/Dockerfile backend
                '''
            }
        }

        stage('Build Frontend Docker Image') {
            steps {
                sh '''
                    echo "Building frontend Docker image..."
                    docker build -t $FRONTEND_IMAGE -f frontend/Dockerfile frontend
                '''
            }
        }

        stage('Login to DockerHub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-credentials',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                        echo "Logging in to DockerHub..."
                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                    '''
                }
            }
        }

        stage('Push Docker Images to DockerHub') {
            steps {
                sh '''
                    echo "Pushing backend image..."
                    docker push $BACKEND_IMAGE

                    echo "Pushing frontend image..."
                    docker push $FRONTEND_IMAGE
                '''
            }
        }

        stage('Update Kubernetes Image Tags') {
            steps {
                sh '''
                    echo "Updating Kubernetes deployment files with new image tags..."
                    pwd
                    cd manifests
                    sed -i "s|image: salmahesham1114/fullstack-demo-project:backend.*|image: $BACKEND_IMAGE|g" fullstack-back-Deployment.yml

                    sed -i "s|image: salmahesham1114/fullstack-demo-project:frontend.*|image: $FRONTEND_IMAGE|g" fullstack-front-Deployment.yml
                '''
            }
        }

        stage('Deploy to Kubernetes'){
            steps {
                sh '''
                echo "Deploying manifests to Kubernetes..."
                kubectl apply -f manifests/

                '''
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully. Application deployed to Kubernetes.'
        }

        failure {
            echo 'Pipeline failed. Check the failed stage in the Jenkins console output.'
        }

        always {
            sh '''
                docker logout || true
            '''
        }
    }
}