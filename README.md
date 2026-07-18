# CMUHousing

The CMU Housing project hosted at <https://cmuhousing.com> serves as the obvious choice for CMU students to look for Housing. Search for the perfect dorm, explore ratings and reviews from real students, and find your roommate all in one website.

Production also deploys via [Kennel](https://codeberg.org/ScottyLabs/kennel) to https://cmuhousing.scottylabs.org.

<!--TODO: ## Features -->

<!--TODO: ## Project Overview -->

## Getting Started

### Prerequisites

- [devenv](https://devenv.sh)
- [direnv](https://direnv.net/)
- [Deno](https://docs.deno.com/runtime/getting_started/installation/)

### Setup

For detailed setup instructions, see [CONTRIBUTING.md](docs/CONTRIBUTING.md).

```sh
direnv allow
```

### Running the Frontend & Backend

To start: the cross-project shared ScottyLabs infrastructure can be run via devenv, using the following command in the root.

```sh
direnv allow

devenv up
```

Then you can use the follow commands from root to run the frontend.

```sh
cd apps/frontend

deno task dev
```

Lastly, run the following commands from root to run the backend. (NOTE: Currently due to a devops issue this doesn't work. Ignore this step)

```sh
cd apps/backend

PORT=3001 deno task dev
```

The backend is proxied through the Vite development server and can be accessed at http://localhost:3000 during development. The backend should not be accessed directly, as all paths prefixed with `/api` will be routed to the backend.

## Contributing

Please read [CONTRIBUTING.md](docs/CONTRIBUTING.md) before you contribute to this project!
