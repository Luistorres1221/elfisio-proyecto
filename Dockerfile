# Stage 1: Build
FROM maven:3.8.1-openjdk-17 AS builder

WORKDIR /app

# Copiar pom.xml y descargar dependencias
COPY backend/pom.xml .
RUN mvn dependency:go-offline -B || true

# Copiar el código fuente
COPY backend/src ./src

# Compilar la aplicación
RUN mvn clean package -DskipTests

# Stage 2: Runtime
FROM openjdk:17-slim

WORKDIR /app

# Copiar el JAR compilado del stage anterior
COPY --from=builder /app/target/backend-0.0.1-SNAPSHOT.jar app.jar

# Puerto en el que corre Spring Boot
EXPOSE 8092

# Variable de entorno para el puerto
ENV PORT=8092
ENV JAVA_OPTS=-Xmx512m

# Comando para ejecutar la aplicación
ENTRYPOINT ["java", "-jar", "app.jar"]
