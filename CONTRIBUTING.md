# Contributing

Contributions are always welcome. Before contributing,
please read the [code of conduct](CODE_OF_CONDUCT.md).

Some thoughts to help you contribute to this project:

## ⚠️ Critical Rule: Healthcare Data Privacy

**Under no circumstances should you ever use, commit, post, or share real patient data (PHI/PII).** 
When submitting bug reports, screenshots, PRs, or writing test seeds, **only use fictitious data** (e.g., "John Doe", fake phone numbers, generated emails). Any PR or Issue containing real medical data will be immediately closed and deleted to comply with global privacy standards (HIPAA/GDPR).

## General Recommendations

1. Always discuss your suggested contribution in an issue, so that we agree on the concept and implementation before the actual work.
2. Leave a detailed description in the Pull Request.
3. Screenshots are preferable for visuals changes.
4. Always communicate. Whether it is in the issue or the pull request, keeping the lines of communication helps everyone around you.
5. If you have any questions, let's discuss them in the issue threads.

## Get Started

1. Fork the repo `https://github.com/MohamedAbdElwahabOka/clinic-management-system-frontend`
2. Clone

   ```shell
   $ git clone https://github.com/<your-name>/clinic-management-system-frontend.git
   $ cd clinic-management-system-frontend
   ```

3. Install dependencies

   ```shell
   $ npm install
   ```
   *(Note: You can also use `pnpm install` or `yarn install` depending on your preference).*

4. Set up environment variables
   Copy the example environment file to set up your local configuration.
   
   ```shell
   $ cp .env.example .env.local
   ```

5. Build the application

   ```shell
   $ npm run build
   ```

6. Start the development server and watch for changes

   ```shell
   $ npm run dev
   ```

7. Open your browser
   Navigate to http://localhost:3000 to see the application in action.

8. Run linters & formatters (if applicable)

    ```shell
    $ npm run lint
    ```

## Pull Requests

### _We actively welcome your pull requests, however linking your work to an existing issue is preferred._

1. Fork the repo and create your branch from `master` (or the main development branch).
2. Name your branch something that is descriptive to the work you are doing. i.e. `feat/adds-patient-search` or `fix/mobile-responsive`.
3. If you've added code that should be tested, ensure it works correctly locally.
4. If you've changed APIs or core architecture, update the relevant documentation.
5. If you make visual changes, screenshots are required in the PR description.
6. Ensure the application builds successfully without errors.
7. Make sure you address any lint warnings.
8. If you make the existing code better, please let us know in your PR description.
9. If your changes are related to localization (i18n), please ensure you follow our feature-based localization structure (e.g., adding to `src/modules/<ModuleName>/locales/`).
10. A PR description and title are required.
11. [Link to an issue](https://help.github.com/en/github/writing-on-github/autolinked-references-and-urls) in the project. An issue is required to announce your intentions and discuss decisions.

### Commit Messages

This project uses [Conventional Commits](https://www.conventionalcommits.org/) format. Please follow this convention to help us maintain a clear and readable git history.
Example: `feat(patients): add search functionality` or `fix(auth): resolve login crash`.

### Work in progress

GitHub has support for draft pull requests, which will disable the merge button until the PR is marked as ready for merge. Use this if you want early feedback on your code before it's finished.

## Issues

If you plan to contribute a change based on an open issue, please assign yourself by commenting on the issue (e.g., with `.take` or a simple comment saying you're working on it). Issues that are not assigned are assumed open, and to avoid conflicts, please assign yourself before beginning work on any issues.

If you would like to contribute to the project for the first time, please consider checking issues labeled `bug`, `documentation`, or `good first issue`.

## License

By contributing to the Clinic Management System project, you agree that your contributions will be licensed under its [MIT license](LICENSE).
