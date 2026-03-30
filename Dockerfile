# Use Maven with JDK 21 to build
FROM maven:3.9-eclipse-temurin-21 as builder

WORKDIR /app

# Copy entire project
COPY . /app/

# Build the backend
WORKDIR /app/backend
RUN mvn clean package -DskipTests -q

# Runtime stage - use lightweight JRE
FROM eclipse-temurin:21-jre-jammy

WORKDIR /app

# Copy only the JAR from builder
COPY --from=builder /app/backend/target/backend-0.0.1-SNAPSHOT.jar /app/app.jar

# Expose port (Railway assigns 8080 by default)
EXPOSE 8080

# Run the application
CMD ["java", "-jar", "/app/app.jar"]

