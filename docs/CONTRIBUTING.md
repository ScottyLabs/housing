# Contributing to CMU Housing

Thank you for your interest in contributing to CMU Housing! This guide will help you get started.

## Setup

Developers should [join the `cmu-housing` team through governance](https://git.cmu.dev/ScottyLabs/governance#joining-a-team). This gives you access to secrets and permission to create branches on the repo.

## How to Contribute

1. **Create a new branch** from latest `main` with a descriptive name:

   ```bash
   git fetch origin main
   git switch main
   git reset --hard origin/main

   git checkout -b feat/your-feature
   # or
   git checkout -b fix/the-bug
   ```

1. **Make your changes** following the code style and conventions

1. **Test your changes** locally by running the project. See [SETUP.md](SETUP.md) for instructions on running the project.

1. **Commit using conventional commits** (see below)

   ```bash
   git add .
   # then
   git commit -m "Your commit message"
   ```

1. **Push to your fork** or branch

   ```bash
   # if first branch push
   git push --set-upstream origin your-branch-name

   # otherwise
   git push
   ```

1. **Open a Pull Request** with a clear description of your changes. You can do this by going to the link provided in the push terminal response or by visiting the repo's homepage on [git.cmu.dev](https://git.cmu.dev/ScottyLabs/housing).

## Conventional Commits

This project follows [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/), which kennel's [git hooks](https://docs.kennel.scottylabs.org/guides/local-development/#git-hooks) check on every commit.

**Examples:**

- `feat: add course search by instructor`
- `fix: resolve dining hall location formatting issue`
- `docs: update README installation steps`
- `refactor: simplify embed pagination logic`
- `chore: update dependencies to latest versions`
- `style: format code with oxfmt`

## Code Editor Setup

We recommend using VS Code, and the following setup guide will assume you are using VS Code.

Recommended VS Code extensions:

- VS Code has builtin TypeScript language support
- [Dependi](https://marketplace.visualstudio.com/items?itemName=fill-labs.dependi)
- [Oxc](https://marketplace.visualstudio.com/items?itemName=oxc.oxc-vscode)
- [Typescript (Native Preview)](https://marketplace.visualstudio.com/items?itemName=typescriptteam.native-preview)
- [Rust Analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)
- [GitLens](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens)
- [Auto Close Tag](https://marketplace.visualstudio.com/items?itemName=formulahendry.auto-close-tag)

You will also need git installed.

## Local Development

See [SETUP.md](SETUP.md) to install Lix, enter the dev shell, and run the app.

## Before Submitting

Before you commit and open a pull request, make sure to:

- Test locally with your changes (`pitchfork start --local`)
- Update documentation if you added/changed features

## Pull Request Guidelines

- **Keep PRs focused** - One feature or fix per pull request
- **Write clear descriptions** - Explain what changed and why
- **Reference related issues** - Use "Fixes #123" or "Closes #456" if applicable
- **Be responsive** - Address review feedback promptly

## Project Priorities & Planning

To understand current priorities, roadmap, and ongoing work:

- Visit the [CMU Housing Development project](https://git.cmu.dev/ScottyLabs/housing/projects/3)
  - Pick an issue from the board and assign it to yourself.
  - Use Priority and Size labels to choose based on what you can handle in a timely fashion.
- If you cannot access the board, [join the `cmu-housing` team through governance](https://git.cmu.dev/ScottyLabs/governance#joining-a-team).

## Need Help?

If you have questions or need help:

- Check existing issues and pull requests for similar questions
- Check resources below for help on issue subject
- Reach out to leadership with questions

Project Resources

- [Figma](https://www.figma.com/design/jxjhX4m6xj4PSZOizoaXHd/CMU-Housing)
- [React Docs](https://react.dev/reference/react)
- [CBP Docs and Meeting Minutes](https://docs.google.com/document/d/1-P8JLaKZ7PBhJOtMzQoG8pInUbNH-Cfx1wHNx3zs_as/edit)
- [Kennel Docs](https://docs.kennel.scottylabs.org/)
- [Google Maps API Docs](https://developers.google.com/maps/documentation/javascript/overview)

Points of Contact

- **Project Lead**: Emma (@sakura888) and Nikhil (@ecstaticpilot)
- **Advisors**: Max (@tentype) and John (@gostmeaper)
- **Outreach/ResEd Contact**: John (@gostmeaper)
- **Senate Contact**: Sanjeev (@blender1778)
- **DevOps**: Ryan (@thesuperrl)
