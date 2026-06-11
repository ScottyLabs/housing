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
cd apps/frontend && npm install
```

## Running the Frontend

```sh
# From the repo root
devenv up

# Or manually
cd apps/frontend && npm run dev
```

Click on the localhost link in the terminal output to see the website!

## Running the Backend

There is no backend at the moment. Instructions will be updated here once it is added!

## Deployment

Production runs on Kennel via devenv and secretspec. Pushes to Codeberg `main` trigger deploys.

URLs:

- https://housing-frontend-main.scottylabs.net (default Kennel URL)
- https://cmuhousing.scottylabs.org (custom domain, managed by Kennel)
- https://cmuhousing.com — point DNS at deploy-01 after verifying the Kennel deploy

Validate locally before pushing:

```sh
SECRETSPEC_PROVIDER=dotenv://.env devenv build scottylabs.kennel.config
nix build .#packages.x86_64-linux.frontend
```
