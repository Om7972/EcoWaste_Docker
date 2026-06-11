provider "aws" {
  region = "ap-south-1"
}

resource "aws_security_group" "allow_web" {
  name        = "allow_web_ecowaste"
  description = "Allow HTTP and SSH"

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Backend API"
    from_port   = 5000
    to_port     = 5000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "docker_server" {

  ami                         = "ami-0f5ee92e2d63afc18"
  instance_type               = "t3.micro"
  associate_public_ip_address = true

  vpc_security_group_ids = [
    aws_security_group.allow_web.id
  ]

  user_data = <<-EOF
              #!/bin/bash

              apt update -y
              apt install docker.io docker-compose -y

              systemctl start docker
              systemctl enable docker

              cat << 'EOT' > /home/ubuntu/docker-compose.yml
              version: '3.8'
              services:
                mongodb:
                  image: mongo:7-alpine
                  container_name: ecowaste-mongodb
                  restart: unless-stopped
                  ports:
                    - "27017:27017"
                  volumes:
                    - mongo_data:/data/db
                  environment:
                    MONGO_INITDB_DATABASE: ecowaste
                  networks:
                    - ecowaste-network

                backend:
                  image: om7972/myapp-backend:latest
                  container_name: ecowaste-backend
                  restart: unless-stopped
                  ports:
                    - "5000:5000"
                  environment:
                    - NODE_ENV=production
                    - PORT=5000
                    - MONGO_URI=mongodb://mongodb:27017/ecowaste
                    - JWT_SECRET=ecowaste_super_secret_key_2024
                    - JWT_EXPIRE=30d
                    - CLIENT_URL=*
                  volumes:
                    - backend_uploads:/app/uploads
                  depends_on:
                    - mongodb
                  networks:
                    - ecowaste-network

                frontend:
                  image: om7972/myapp-frontend:latest
                  container_name: ecowaste-frontend
                  restart: unless-stopped
                  ports:
                    - "80:3000"
                  environment:
                    - VITE_API_URL=http://localhost:5000/api
                  depends_on:
                    - backend
                  networks:
                    - ecowaste-network

              volumes:
                mongo_data:
                  name: ecowaste_mongo_data
                backend_uploads:
                  name: ecowaste_backend_uploads

              networks:
                ecowaste-network:
                  driver: bridge
                  name: ecowaste_bridge
              EOT

              cd /home/ubuntu
              docker-compose up -d
              EOF

  tags = {
    Name = "Docker-Server"
  }
}

output "public_ip" {
  value = aws_instance.docker_server.public_ip
}

output "instance_id" {
  value = aws_instance.docker_server.id
}