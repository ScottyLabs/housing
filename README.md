# CMUHousing

The CMU Housing project serves as the obvious choice for CMU students to look for Housing. Search for the perfect dorm, explore ratings and reviews from real students, and find your roommate all in one website.

Production is hosted on [Kennel](https://codeberg.org/ScottyLabs/kennel):

- https://housing-frontend-main.scottylabs.net
- https://cmuhousing.scottylabs.org
- https://cmuhousing.com (DNS cutover pending)

## Getting Started

### Prerequisites

- [devenv](https://devenv.sh)
- [direnv](https://direnv.net/)

### Setup

For detailed setup instructions, see [CONTRIBUTING.md](docs/CONTRIBUTING.md).

```sh
cd housing
direnv allow
```

### Running the Frontend

```sh
# Start the dev server (postgres not required — frontend only)
devenv up

# Or run the frontend process directly
cd apps/frontend && npm run dev
```

Click on the localhost link in the terminal output to see the website!

### Running the Backend

There is no backend at the moment. Instructions will be updated here once it is added!

### Validating Kennel config

Before pushing to Codeberg, confirm Kennel can build the project:

```sh
SECRETSPEC_PROVIDER=dotenv://.env devenv build scottylabs.kennel.config
nix build .#packages.x86_64-linux.frontend
```

## Contributing

Please read [CONTRIBUTING.md](docs/CONTRIBUTING.md) before you contribute to this project!
