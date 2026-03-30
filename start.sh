#!/usr/bin/env bash
set -e

echo "Installing dependencies if needed..."
if ! command -v mvn &> /dev/null; then
    echo "Maven not found, installing..."
    apt-get update && apt-get install -y maven
fi

cd backend
echo "Building backend with Maven..."
chmod +x mvnw
# Try using Maven wrapper first, fallback to mvn if it fails
./mvnw clean package -DskipTests || mvn clean package -DskipTests

echo "Starting application..."
java -jar target/backend-0.0.1-SNAPSHOT.jar --server.port=${PORT:-8092}
