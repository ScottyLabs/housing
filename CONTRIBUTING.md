# Contributing to CMUHousing

Thank you for your interest in contributing to CMUHousing! This guide will help you get started.

## How to Contribute

1. **Fork the repository** or create a new branch if you have write access
2. **Create a new branch** from `main` with a descriptive name:

   ```bash
   git checkout -b your-feature-name
   # or
   git checkout -b bug-description
   ```

3. **Make your changes** following the code style and conventions
4. **Test your changes** locally by running the project. See [README.md](README.md) for more instructions on running the project.
5. **Commit using conventional commits** (see below)
6. **Push to your fork** or branch
7. **Open a Pull Request** with a clear description of your changes

## Conventional Commits

This project follows [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).

**Examples:**

- `feat: add course search by instructor`
- `fix: resolve dining hall location formatting issue`
- `docs: update README installation steps`
- `refactor: simplify embed pagination logic`
- `chore: update dependencies to latest versions`
- `style: format code with biome`

## Code Editor Setup

We recommend using VSCode, and the following setup guide will assume you are using VSCode.

Recommended VSCode extensions:

- VSCode has builtin TypeScript language support
- [Dependi](https://marketplace.visualstudio.com/items?itemName=fill-labs.dependi)
- [Oxc](https://marketplace.visualstudio.com/items?itemName=oxc.oxc-vscode)
- [Typescript (Native Preview)](https://marketplace.visualstudio.com/items?itemName=typescriptteam.native-preview)
- [Rust Analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)
- [GitLens](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens)
- [Auto Close Tag](https://marketplace.visualstudio.com/items?itemName=formulahendry.auto-close-tag)

You will also need git installed.

<!--TODO: ## Creating your .env file -->

<!--TODO: ## Database Setup  -->

## Before Submitting

Before you commit and open a pull request, make sure to:

- Run `bun lint` and fix any errors/warnings
- Run `bun format` to format your code
- Test locally with your changes
- Ensure your commits follow conventional commit format
- Update documentation if you added/changed features

## Pull Request Guidelines

- **Keep PRs focused** - One feature or fix per pull request
- **Write clear descriptions** - Explain what changed and why
- **Reference related issues** - Use "Fixes #123" or "Closes #456" if applicable
- **Be responsive** - Address review feedback promptly

## Project Priorities & Planning

To understand current priorities, roadmap, and ongoing work:

- Visit the [CMUHousing Development project](https://github.com/orgs/ScottyLabs/projects/29)
- If you cannot access the board, ask a maintainer to add you to the ScottyLabs organization.

## Need Help?

If you have questions or need help:

- Check existing issues and pull requests for similar questions
- Check resources below for help on issue subject
- Reach out to leadership with questions

Project Resources

- [Figma](https://www.figma.com/design/jxjhX4m6xj4PSZOizoaXHd/CMU-Housing/)
- [React Docs](https://react.dev/reference/react)
- [CBP Docs and Meeting Minutes](https://docs.google.com/document/d/1-P8JLaKZ7PBhJOtMzQoG8pInUbNH-Cfx1wHNx3zs_as/edit)
- [ScottyLabs Tech Docs](https://docs.scottylabs.org/)

Points of Contact

- **Project Lead**: Nikhil (@ecstaticpilot)
- **Advisors**: Max (@tentype) and John (@gostmeaper)
- **Outreach/ResEd Contact**: John (@gostmeaper)
- **Senate Contact**: Sanjeev (@blender1778)
- **DevOps**: Ryan (@thesuperrl)

Remember to follow conventional committing guidelines while contributing!
