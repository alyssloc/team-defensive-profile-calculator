#1- setting starting enviornment
FROM ubuntu:22.04 AS builder

#2- installing compilation tools and Asio library dependencies
ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    build-essential \
    g++ \
    libasio-dev \
    && rm -rf /var/lib/apt/lists/*

#3- setting working directory
WORKDIR /app

#4- copy files into container
COPY . .

#5- compiling
RUN g++ -std=c++17 -O3 -Isrc \
    src/server.cpp src/pokemon.cpp src/team.cpp src/utilities.cpp \
    -lpthread -o pokemon_defensive_profile_api_engine

#6- running container
FROM ubuntu:22.04

#creating user to run the app
RUN useradd -m appuser
WORKDIR /home/appuser

# copying compiled binary from step #5
COPY --from=builder /app/pokemon_defensive_profile_api_engine .

#giving the user permissions to run
RUN chown -R appuser:appuser /home/appuser
USER appuser

# exposing runtime port
EXPOSE 8080

#7- executing
CMD ["./pokemon_defensive_profile_api_engine"]