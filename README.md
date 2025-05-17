# Unreal Learning

This repository is a starting point for experimenting with **elizaOS** and Docker-based deployment strategies.

## Getting Started

1. Clone the elizaOS repository and check out the `v2-develop` branch:
   ```sh
   git clone -b v2-develop <elizaOS_repo_url>
   ```
   Replace `<elizaOS_repo_url>` with the actual repository URL. Network access may be required.
2. Follow the elizaOS documentation to install and configure the system.
3. Install dependencies and start the example microservice:
   ```sh
   pip install -r requirements.txt
   python app/main.py
   ```
4. (Optional) Build the Docker image for containerized deployment:
   ```sh
   docker build -t unreal-learning .
   ```

For detailed objectives and planning, see [docs/PRD.md](docs/PRD.md).
