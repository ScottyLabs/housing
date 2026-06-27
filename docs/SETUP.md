---
title: Setup
---

# Setup

For ScottyLabs Org Member setup instructions, see [CONTRIBUTING.md](CONTRIBUTING.md).

## Prerequisites

- [devenv](https://devenv.sh)
- [direnv](https://direnv.net/)

## Initial Setup

```sh
cd housing
direnv allow
```

## Running the Frontend

```sh
# From the repo root
devenv up
```

The backend is proxied through the Vite development server and can be accessed at http://localhost:3000 during development. The backend should not be accessed directly, as all paths prefixed with `/api` will be routed to the backend.

## Deployment

Production runs on Kennel via devenv and secretspec. Pushes to Codeberg `main` trigger deploys.

URLs:

- https://housing-frontend-main.scottylabs.net (default Kennel URL)
- https://cmuhousing.scottylabs.org (custom domain, managed by Kennel)
- https://cmuhousing.com — point DNS at deploy-01 after verifying the Kennel deploy

Validate locally before pushing:

```sh
SECRETSPEC_PROVIDER=dotenv://.env devenv build scottylabs.kennel.config
nix build
```
