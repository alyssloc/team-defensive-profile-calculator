
# Pokémon Team Defensive Profile Calculator

This project evaluates a team of up to six Pokémon and calculates their combined defensive coverage against every type in the game.
Helpful in determining your team's defensive holes, especially for nuzlocking

--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

Architecture & Tech Stack:

Decoupled frontend and backend microservices containerized with Docker, provisioned via Terraform, and deployed to Google Cloud Run.

--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

System Components:

Frontend: React SPA (TypeScript / Vite) compiled to static assets and served via an isolated Cloud Run service.

Backend: Stateless C++20 REST API using the Crow microframework. Executes defensive type-chart computations and exposures a single POST/OPTIONS endpoint at /calculate.

Infrastructure: Declarative GCP resource provisioning managed via Terraform (IaC).

CI/CD: Automated GitHub Actions pipelines for Docker container builds, Artifact Registry pushes, and Cloud Run deployments upon code merge.

-----------------------------------------------------------------------------


Data Flow & Integration:


Client selects type inputs in the React UI.

Frontend dispatches a JSON payload containing the generation integer and an array of type strings via native fetch.

Backend parses the request payload, handles the CORS preflight OPTIONS handshake, maps inputs to type-chart enums, calculates defensive values, and returns a JSON array of type-score pairs.



## Run Locally

Clone the project

```bash
  git clone https://github.com/alyssloc/team-defensive-profile-calculator
```

Go to the project directory

```bash
  cd team-defensive-profile-calculator
```

Install dependencies

```bash
  sudo apt update && sudo apt install build-essential

```

Compile

```bash
  make
```
Run via the command line

```bash
  ./bin/calculator
```


