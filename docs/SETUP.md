# Setup

For ScottyLabs Org Member setup instructions, see [CONTRIBUTING.md](CONTRIBUTING.md).

## Prerequisites

Install Lix and log in to OpenBao by following kennel's [local development](https://docs.kennel.scottylabs.org/guides/local-development/#installing-nix) and [secrets](https://docs.kennel.scottylabs.org/guides/secrets/#local-development) guides.

## Initial Setup

```sh
cd housing
nix develop
```

## Running the app

Start PostgreSQL, the Ricochet login relay, the backend on port 3001, and the frontend from the repo root:

```sh
pitchfork start --local
```

The backend is proxied through the Vite development server and can be accessed at http://localhost:3000 during development. The backend should not be accessed directly, as all paths prefixed with `/api` will be routed to the backend.

## Deployment

[Kennel](https://docs.kennel.scottylabs.org/guides/deploying/) deploys the `backend` service in `flake.nix`, which also serves the built frontend, at <https://cmuhousing.com>.
