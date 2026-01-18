This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Code Quality and Linting

This project uses ESLint, husky, and lint-staged to automatically enforce code quality and style.

### Real-time Error Checking

For the best development experience, it is highly recommended to install an ESLint extension in your code editor (e.g., the official [ESLint extension for VS Code](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)). This will provide real-time feedback and highlight errors as you type.

### Pre-commit Hook

Before any new code is committed, a pre-commit hook will automatically run ESLint on the files you have changed. This prevents code with linting errors from being added to the repository.

### One-Time Setup

To enable the pre-commit hook, you will need to install the new dependencies and make the hook executable. Please run the following commands once:

```bash
# Install new dev dependencies (husky, lint-staged)
npm install

# Make the pre-commit hook executable
chmod +x .husky/pre-commit
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
