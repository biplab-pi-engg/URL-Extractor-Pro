# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.0] - 2025-05-15

### Added
- **Development Tooling**:
  - ESLint for JavaScript linting to enforce code style and catch errors.
  - Prettier for automated code formatting to ensure consistent style.
  - Jest for unit testing, with initial tests for UI helper functions (`formatTimestamp`, `escapeHtml`), utility functions (`generateId`), and regex input validation (`validateRegexInput`).
- **Project Documentation**:
  - Updated `CONTRIBUTING.md` to include guidelines for using ESLint, Prettier, and Jest.
  - Added `package.json` with scripts for linting, formatting, and testing.
  - Added configuration files: `.eslintrc.json`, `.prettierrc.json`, `.prettierignore`.
  - Updated `.gitignore` to include `node_modules/`, `package-lock.json`, and Jest's `coverage/` directory.

### Changed
- **Codebase Refactoring**:
  - Significantly refactored `popup.js` by modularizing its core functionalities into separate JavaScript modules:
    - `js/constants.js`: For shared constants like storage keys and default values.
    - `js/storage.js`: For all interactions with `chrome.storage.local` (loading/saving data).
    - `js/ui.js`: For UI helper functions (e.g., `showStatus`, `formatTimestamp`, `escapeHtml`, `displayGroupedUrls`, `openUrlInBackground`).
    - `js/utils.js`: For general utility functions (e.g., `generateId`).
    - `js/regex.js`: For managing regex patterns, including CRUD operations, UI rendering for the regex list, and input validation.
    - `js/history.js`: For managing the extraction history, including adding items, rendering the history list, and clearing history.
    - `js/extractor.js`: For the main URL extraction logic from the current page's HTML.
  - `popup.js` now primarily acts as an orchestrator, initializing modules and handling top-level event listeners.
- **Code Quality & Consistency**:
  - Applied ESLint and Prettier rules across the JavaScript codebase (implicitly, as part of their setup).
  - Improved code organization and maintainability through modularization.
  - Enhanced input validation for regex patterns in `js/regex.js` by extracting it into a testable `validateRegexInput` function.
- **Build & Contribution Process**:
  - Standardized development workflow with linting, formatting, and testing scripts in `package.json`.

## [1.2.1] - 2025-05-12

### Fixed
- Fixed URL Extractor breaking due to escape characters.

## [1.2.0] - 2025-05-12

### Added
- New icon buttons in URL list items for improved user interaction
- Copy to clipboard functionality for extracted URLs
- Visual feedback when URLs are copied (checkmark icon and temporary highlighting)
- Improved action buttons layout with consistent styling across the extension
- Better visual distinction between URL text and action buttons

### Changed
- Redesigned URL list items to use icon-based buttons instead of text buttons
- Updated styling for action buttons to use a more compact, icon-based design
- Improved spacing and alignment in URL list items
- Enhanced visual feedback for user interactions (button hover states, copy confirmation)
- Standardized button appearance across different tabs for better consistency

### Fixed
- Improved word breaking for long URLs to prevent layout issues
- Better handling of URL text overflow with proper truncation and tooltips
- Consistent styling between extract results and history items

## [1.1.2] - 2025-04-12

### Changed

- Changes the icons to the new ones.
- Renamed the extension to "URL Extractor Pro".

## [1.1.0] - 2025-04-11

### Added

- History tab to view previously extracted unique URLs.
- Search functionality within the History tab.
- Sorting functionality (Newest/Oldest) for the History tab.
- Manage Regex tab for adding, editing, and deleting custom regex patterns.
- Grouping of extracted URLs under the corresponding regex pattern name in the Extract tab.
- Persistence for Regex patterns and History using `chrome.storage.local`.
- Basic regex validation in the Manage Regex form.
- LICENSE file (MIT).
- CONTRIBUTING.md guidelines.
- PRIVACY_POLICY.md file (copy for repo).
- .gitignore file.

### Changed

- Renamed extension to "URL Extractor Pro".
- Updated UI to use a tabbed interface.
- Enhanced error handling and status messages across all tabs.
- Extraction process now uses all saved regex patterns instead of a single hardcoded one.
- Refactored `popup.js` for better organization and to support new features.
- Updated `README.md` to reflect new features and structure.
- Increased minimum popup width in `popup.css`.

### Fixed

- URLs are now escaped using `escapeHtml` before rendering to prevent potential XSS issues.
- Ensured script injection checks for restricted pages (`chrome://`, web store).

## [1.0.0] - 2025-04-10

### Added

- Initial release.
- Basic functionality to extract hardcoded CodeDeploy URLs from page HTML.
- Display results in the popup with "Open" buttons.
- Open URLs in background tabs.
- Basic `manifest.json`, `popup.html`, `popup.js`, `popup.css`.
- Placeholder Icons.
