# ECell-RVU Website

---

## Demo

https://github.com/user-attachments/assets/9ab5ec05-6a5e-4ba2-923c-7685b89def26

---

## Introduction

The ECell-RVU Website is designed to provide an engaging and informative online platform for the Entrepreneurship Cell at RV University. It showcases the organization, its team, speakers, sponsors, activities, and interactive features while providing visitors with an accessible overview of ECell-RVU and its initiatives.

---

## File Structure

```text
ECell-Web/
├── .github/
│   └── workflows/           # GitHub Actions workflows
├── app/                     # Next.js application routes/pages
├── public/                  # Static assets
├── src/                     # Main source code  
├── tests/                   # Automated tests
├── .gitignore               # Git ignore rules
├── CONTRIBUTING.md          # Contribution guidelines
├── eslint.config.mjs        # ESLint configuration
├── next-env.d.ts            # Next.js TypeScript declarations
├── next.config.ts           # Next.js configuration
├── package.json             # Dependencies and scripts
├── package-lock.json        # Locked dependency versions
├── postcss.config.mjs       # PostCSS configuration
├── README.md                # Project documentation
├── tsconfig.json            # TypeScript configuration
├── vercel.json              # Vercel configuration
└── vitest.config.mts        # Vitest configuration
```

## Manual Vercel deployment

This repository includes a GitHub Actions workflow for production deployments:
`.github/workflows/deploy-vercel.yml`.

Before using it, add these repository or `production` environment secrets in
GitHub under **Settings → Secrets and variables → Actions**:

- `VERCEL_TOKEN` — a Vercel access token
- `VERCEL_ORG_ID` — the Vercel team ID (or account ID)
- `VERCEL_PROJECT_ID` — the Vercel project ID

To deploy, open **Actions → Deploy to Vercel → Run workflow**, select the
`main` branch, and run it. The workflow builds and deploys the prebuilt output
to Vercel production.
---

## Contributors 

- [@AkshayS2020git](https://github.com/AkshayS2020git)
- [@akash0-real](https://github.com/akash0-real)
- [@shrisha77-boop](https://github.com/shrisha77-boop)
- Aditya Dixit
