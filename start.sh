#!/usr/bin/env bash
set -e
cd backend
# Use Maven Wrapper instead of system mvn, porque en Railway no hay mvn global
chmod +x mvnw
./mvnw clean package -DskipTests
java -jar target/backend-0.0.1-SNAPSHOT.jar --server.port=${PORT:-8092}
