## Code Quality Guidelines

To ensure the highest standards of code quality and maintainability, we ask all contributors to adhere to the following guidelines when contributing to Workflomics:

### TypeScript Standards

- Follow the [TypeScript coding guidelines](https://github.com/microsoft/TypeScript/wiki/Coding-guidelines) for TypeScript code.
- Use `eslint` and `prettier` for linting and formatting your code. Ensure your code passes all lint checks before submitting a pull request.

### React Best Practices

- Keep components small and focused on a single responsibility.
- Use functional components with hooks for state management and side effects.
- Place all components in the `components` directory, and use the naming convention `ComponentName.tsx` for component files.
- For state management, prefer context and hooks; use state management libraries (like Redux) only if necessary for global state.

### Node.js and Express Best Practices

- Use async/await for asynchronous code for better readability and error handling.
- Validate and sanitize input data to prevent security vulnerabilities.
- Handle errors properly and send meaningful error responses to the client.

### Testing (still in progress)

- Write unit tests for all new code and changes to existing code. We use Jest as our testing framework.
- Aim for a high test coverage to ensure code quality and prevent regressions.
- Tests should be placed in a `__tests__` directory within the same directory as the tested code.

### Documentation

- Document all public functions and components with JSDoc comments.
- Update the README.md with any changes in the setup process or added functionalities.
- If you introduce new features, include examples or update existing examples to reflect the change.
- Update the [readthedocs](https://workflomics.readthedocs.io/en/latest/?badge=latest) documentation if your changes affect the user-facing documentation.

### Pull Requests

- Provide a clear description of the problem and solution in your pull request.
- Include screenshots or GIFs if your changes affect the UI.
- Link to the related issue(s) in your pull request description.

By following these guidelines, you help ensure that Workflomics remains a high-quality, maintainable, and user-friendly platform. We appreciate your contributions and efforts to improve the project.
