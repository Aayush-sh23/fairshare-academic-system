# Contributing to FairShare

First off, thank you for considering contributing to FairShare! It's people like you that make FairShare such a great tool for academic fairness.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* **Use a clear and descriptive title**
* **Describe the exact steps which reproduce the problem**
* **Provide specific examples to demonstrate the steps**
* **Describe the behavior you observed after following the steps**
* **Explain which behavior you expected to see instead and why**
* **Include screenshots if possible**

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

* **Use a clear and descriptive title**
* **Provide a step-by-step description of the suggested enhancement**
* **Provide specific examples to demonstrate the steps**
* **Describe the current behavior and explain which behavior you expected to see instead**
* **Explain why this enhancement would be useful**

### Pull Requests

* Fill in the required template
* Do not include issue numbers in the PR title
* Follow the JavaScript/Node.js styleguide
* Include thoughtfully-worded, well-structured tests
* Document new code
* End all files with a newline

## Development Process

1. Fork the repo
2. Create a new branch from `main`:
   ```bash
   git checkout -b feature/my-new-feature
   ```
3. Make your changes
4. Test your changes thoroughly
5. Commit your changes:
   ```bash
   git commit -m "Add some feature"
   ```
6. Push to your fork:
   ```bash
   git push origin feature/my-new-feature
   ```
7. Create a Pull Request

## Styleguides

### Git Commit Messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line

### JavaScript Styleguide

* Use ES6+ features
* Use async/await instead of callbacks
* Use meaningful variable names
* Add comments for complex logic
* Follow existing code style

### Documentation Styleguide

* Use Markdown
* Reference functions and classes in backticks: \`functionName()\`
* Include code examples where appropriate

## Project Structure

```
fairshare-academic-system/
├── server.js           # Main server file
├── database.js         # Database schema and initialization
├── routes/             # API route handlers
│   ├── auth.js        # Authentication routes
│   ├── projects.js    # Project management
│   ├── tasks.js       # Task management
│   ├── activity.js    # Activity tracking
│   ├── analytics.js   # Analytics and reporting
│   └── feedback.js    # Peer feedback
└── README.md          # Documentation
```

## Testing

Currently, the project doesn't have automated tests. Contributing test coverage would be highly appreciated!

## Questions?

Feel free to open an issue with your question or reach out to the maintainers.

Thank you for contributing! 🎉