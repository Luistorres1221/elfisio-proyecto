FROM maven:latest

WORKDIR /app

COPY backend/pom.xml .
COPY backend/src ./src

RUN mvn clean package -DskipTests

EXPOSE 8092

ENTRYPOINT ["java", "-jar", "target/backend-0.0.1-SNAPSHOT.jar"]
