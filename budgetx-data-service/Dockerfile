FROM eclipse-temurin:21-jdk-jammy AS build
WORKDIR /workspace
COPY gradlew .
COPY gradle ./gradle
COPY build.gradle.kts .
COPY settings.gradle.kts .
# Copy src for the build
COPY src ./src
# Build avoiding tests simply to build the image (since CI runs tests separately)
RUN ./gradlew bootJar -x test

# Note: The app should be running in Asia/Kolkata timezone
FROM eclipse-temurin:21-jre-jammy
ENV TZ="Asia/Kolkata"
RUN apt-get update && apt-get install -y tzdata && \
    ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY --from=build /workspace/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
