# CMUHousing

The CMU Housing project is hosted at https://cmuhousing.com, however it is currently in alpha and lacks functionality in many regards. Take it as a demo of what the site will appear like, not an MVP.

## Getting Started

### Prerequisites
- [Bun](https://bun.com/docs/installation) - JavaScript runtime and package manager

### Initial Setup
```sh
# Install dependencies in the root directory (you only need to do this once)
bun install
```

### Running the Frontend
```sh
# Move to the frontend directory
cd apps/frontend

# Install frontend dependencies (you only need to do this once)
bun install

# Run the website
bun run dev
```
Click on the localhost link in the terminal output to see the website!

### Running the Backend
There is no backend at the moment. Instructions will be updated here once it is added!

## Etiquette
Before pushing code, it is required that you lint and format it to ensure proper format and consistency. You can do this with the following commands in the root directory of this project (where this README is located).

```sh
bun run lint
bun run format
```
