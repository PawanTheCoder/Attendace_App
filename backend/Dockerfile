### Stage 1: Build the application using Maven
FROM maven:3.9.4-eclipse-temurin-17 AS build
WORKDIR /workspace

# Copy only the files required for dependency resolution first for better caching
COPY pom.xml mvnw ./
COPY .mvn .mvn
RUN mvn -B -f pom.xml -q dependency:go-offline

# Copy the source code
COPY src ./src

# Package the application (skip tests to speed up build)
RUN mvn -B -f pom.xml -DskipTests package


### Stage 2: Create a lightweight runtime image
FROM eclipse-temurin:17-jre-alpine
VOLUME /tmp

# Expose the port the app runs on
EXPOSE 8080

# Copy the jar from the build stage
ARG JAR_FILE=target/backend-0.0.1-SNAPSHOT.jar
COPY --from=build /workspace/${JAR_FILE} /app/app.jar

ENTRYPOINT ["/bin/sh","-c","java -Xms128m -Xmx512m -jar /app/app.jar"]
