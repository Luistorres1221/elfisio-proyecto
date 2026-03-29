# Stage 1: Build
FROM maven:3.9.4-eclipse-temurin-17 AS builder

WORKDIR /app

# Copiar pom.xml y descargar dependencias
COPY backend/pom.xml .
RUN mvn dependency:go-offline -B

# Copiar el código fuente
COPY backend/src ./src

# Compilar la aplicación
RUN mvn clean package -DskipTests

# Stage 2: Runtime
FROM eclipse-temurin:17-jre-slim

WORKDIR /app

# Copiar el JAR compilado del stage anterior
COPY --from=builder /app/target/backend-0.0.1-SNAPSHOT.jar app.jar

# Puerto en el que corre Spring Boot
EXPOSE 8092

# Comando para ejecutar la aplicación
CMD ["java", "-jar", "app.jar"]
