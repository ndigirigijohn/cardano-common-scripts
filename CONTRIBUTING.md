# Contributing Guide

Thanks for helping grow `cardano-common-snippets`! This project aims to provide
tested, copy/paste friendly snippets for common Cardano tasks. Keep
contributions lean and practical.

## 1. Basics
- Fork this repository and create a new branch per contribution.
- Clone your fork locally and install dependencies with `npm install`.
- Keep contributions focused: one logical change per pull request.

## 2. Snippet Standards
- Provide both Node.js and `cardano-cli` variants where applicable.
- Follow the existing directory structure (`snippets/<category>/`).
- Include inline comments only when clarifying intent; avoid noise.
- Place runtime artifacts under `outputs/` and keep them out of commits.

## 3. Git Workflow
1. Create a descriptive branch:  
   `git checkout -b feature/wallet-restore`
2. Make your changes and run any applicable scripts/tests.
3. Stage files:  
   `git add <paths>`
4. Write a clear commit message (present tense, short summary):  
   `git commit -m "Add wallet restore snippet pair"`
5. Push to your fork:  
   `git push origin feature/wallet-restore`
6. Open a pull request against `main`.

## 4. Pull Request Checklist
- [ ] Snippets run successfully (`npm run ...` or `./snippets/...`).
- [ ] Documentation updated (README, SNIPPETS, OUTPUT, etc.).
- [ ] `.env` or secret files are **not** committed.
- [ ] `npm test` (if applicable) passes.
- [ ] Described testing steps in the PR body.

## 5. Code Review Tips
- Be concise and respectful.
- Explain **why** changes were made.
- Respond to review comments promptly.

## 6. Getting Help
- Questions? Open a GitHub Discussion or Issue.
- Need guidance on Cardano specifics? Share context and error output.

Thanks again for contributing!🚀

