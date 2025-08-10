# Contributing to Nocturnal

First off, thank you for considering contributing to Nocturnal! It's people like you that make Nocturnal such a great tool.

## Code of Conduct

By participating in this project, you are expected to uphold our Code of Conduct. Please report unacceptable behavior to the project maintainers.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* Use our bug report template
* Include specific information about your environment (OS version, Nocturnal version)
* Provide clear steps to reproduce the issue
* Include screenshots if applicable

### Suggesting Enhancements

If you have a suggestion for a new feature or an improvement:

* Use our feature request template
* Provide a clear and detailed explanation of the feature
* Include examples of how this feature would be used
* Explain why this enhancement would be useful to most Nocturnal users

### Development Process

1. Fork the repo
2. Clone your fork
3. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-fix-name
   ```

### Setting Up Development Environment

1. Ensure you have the following installed:
   * Node.js (Latest LTS version)
   * Rust and Cargo
   * Git

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development:
   ```bash
   npm run tauri:dev
   ```

### Building

To build Nocturnal:
```bash
npm run tauri dev

npm run tauri build
```

### Style Guidelines

#### JavaScript/TypeScript
* Use TypeScript for new code
* Follow the existing code style
* Use biome configuration provided in the project
* Write meaningful variable and function names
* Add JSDoc comments for public APIs

#### Rust
* Follow Rust standard naming conventions
* Use `cargo fmt` before committing

### Git Commit Messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line

### Pull Request Process

1. Follow all instructions in the template
2. Update the README.md with details of changes if applicable
3. Update the documentation when adding or modifying features
4. Test your changes thoroughly
5. Ensure the PR description clearly describes the problem and solution
6. Include screenshots for UI changes

## Documentation

* Keep README.md up to date
* Document new features
* Write clear commit messages

Thank you for contributing to Nocturnal! 🚀 
