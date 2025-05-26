# Contributing to URL Extractor Pro

First off, thank you for considering contributing! Your help is appreciated to make this extension even better.

This document provides guidelines for contributing to the project.

## How Can I Contribute?

- **Reporting Bugs:** Find something not working as expected? Please open an issue on the GitHub repository!
- **Suggesting Enhancements:** Have an idea for a new feature or an improvement to an existing one? Open an issue to discuss it.
- **Submitting Code Changes:** Found a bug you can fix or want to implement a feature? Awesome! Please follow the Pull Request process below.

## Reporting Bugs

When reporting a bug, please include the following details in your GitHub issue:

1.  **Clear Title:** A concise summary of the issue.
2.  **Description:** A detailed description of the problem.
3.  **Steps to Reproduce:** Provide clear, numbered steps on how to trigger the bug.
4.  **Expected Behavior:** What did you expect to happen?
5.  **Actual Behavior:** What actually happened? Include any error messages shown in the extension popup or the browser's Developer Console (F12 -> Console).
6.  **Environment:** Your operating system, Chrome browser version.
7.  **Screenshots (Optional):** Visual aids are often very helpful.

## Suggesting Enhancements

When suggesting an enhancement:

1.  **Clear Title:** A concise summary of the feature request.
2.  **Motivation:** Why is this enhancement needed? What problem does it solve?
3.  **Proposed Solution:** Describe how you envision the feature working. Mockups or detailed descriptions are welcome.
4.  **Alternatives (Optional):** Have you considered other ways to achieve the same goal?

## Submitting Code Changes (Pull Requests)

1.  **Fork the Repository:** Create your own copy of the repository on GitHub.
2.  **Clone Your Fork:** Clone your forked repository to your local machine.
    ```bash
    git clone https://github.com/YOUR_USERNAME/html-url-extractor-enhanced.git
    cd html-url-extractor-enhanced
    ```
3.  **Create a Branch:** Create a new branch for your changes. Use a descriptive name (e.g., `fix-history-sorting`, `feature-regex-export`).
    ```bash
    git checkout -b name-of-your-branch
    ```
4.  **Make Changes:** Implement your fix or feature.
5.  **Test Your Changes:**
    - Load the extension into Chrome as an unpacked extension (using the `html-url-extractor-enhanced` directory).
    - Thoroughly test the functionality you added or modified. Ensure existing features still work correctly. Check for errors in the console.
6.  **Commit Your Changes:** Write clear, concise commit messages explaining _what_ change was made and _why_.
    ```bash
    git add .
    git commit -m "Fix: Corrected history sorting logic"
    ```
7.  **Push to Your Fork:** Push your branch to your forked repository on GitHub.
    ```bash
    git push origin name-of-your-branch
    ```
8.  **Open a Pull Request (PR):**
    - Go to your fork on GitHub.com.
    - Click the "Compare & pull request" button for your branch.
    - Ensure the base repository is the original project and the head repository is your fork/branch.
    - Provide a clear title and description for your PR, explaining the changes and referencing any related GitHub issues (e.g., "Closes #12").
    - Submit the Pull Request.

## Code Style

- **Consistency:** Try to maintain consistency with the existing code style.
- **Readability:** Write clear, readable code. Add comments where necessary to explain complex parts.
- **JavaScript:** Follow general modern JavaScript best practices (e.g., use `const` and `let` appropriately, use async/await for promises).

## Code Style and Quality

To maintain a consistent code style and ensure code quality, this project uses ESLint for linting and Prettier for code formatting. These tools are configured in `package.json` and their respective configuration files (`.eslintrc.json`, `.prettierrc.json`).

**1. Install Development Dependencies:**

Before you can run the linter or formatter, you need to install the project's development dependencies (which include ESLint and Prettier). From the root of the project, run:

```bash
npm install
```

This command reads the `package.json` file and installs the packages listed in `devDependencies`.

**2. Linting:**

ESLint helps identify and report on patterns found in ECMAScript/JavaScript code, with the goal of making code more consistent and avoiding bugs.

- To check your code for linting errors, run:
  ```bash
  npm run lint
  ```
  This will output any violations to the console.

- To attempt to automatically fix many linting issues, run:
  ```bash
  npm run lint:fix
  ```

**3. Formatting:**

Prettier is an opinionated code formatter that enforces a consistent style by parsing your code and re-printing it with its own rules.

- To automatically format all JavaScript files in the project according to the Prettier configuration, run:
  ```bash
  npm run format
  ```

**Before Submitting Pull Requests:**

Please ensure you run these tools on your code before submitting a pull request:

1.  Run `npm run lint` to check for any linting errors. Try to fix them manually or by using `npm run lint:fix`.
2.  Run `npm run format` to ensure your code style is consistent with the project's standards.

This helps streamline the review process and maintain a high quality, consistent codebase.

## Conduct

Please interact respectfully with other contributors and maintainers. We aim for a positive and collaborative environment.

Thank you again for your interest in contributing!
