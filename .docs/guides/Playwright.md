# Integrating Playwright into a project

Playwright is a Node.js library to automate the browser. It is a powerful tool to test web applications, but it can also be used to automate repetitive tasks in the browser.

In this guide, we will show you how to integrate Playwright into a project.

## Installation

https://playwright.dev/docs/intro

```bash
pnpm create playwright
```

Run the install command and select the following to get started:

- Choose between TypeScript or JavaScript (default is TypeScript)
- Name of your Tests folder (default is tests or e2e if you already have a tests folder in your project)
- Add a GitHub Actions workflow to easily run tests on CI
- Install Playwright browsers (default is true)

## Usage



Run the example test:

```bash
pnpm playwright test
```

The above runs in headless mode.

To get a better view, run:

```bash
pnpm playwright test --ui
```

## VSCode extension

Tests can be executed and inspected more easily with the Playwright Test extension for VSCode.

https://playwright.dev/docs/getting-started-vscode


Get it here [Playwright Test](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright)


## Trace view

The trace view is a powerful tool to debug your tests. It shows the browser's actions and the test code side by side. It also opens in your default browser, so if you're running from WSL it will work best.

In VSCode, just tick the checkbox "Trace browser" and run the tests you want.

## Writing tests

```typescript
import { test, expect } from '@playwright/test';
test.use({
  ignoreHTTPSErrors: true,
  baseURL: 'https://localhost:9005',
  screenshot: 'on',
  viewport: { width: 1920, height: 1080 },
});

test('basic test', async ({ page }) => {
  await page.goto('/');
  const title = page.locator('title');
  await expect(title).toHaveText('Test');
});
```

In the above snippet we configure the test to ignore HTTPS errors, set a base URL, take screenshots on failure, and set the viewport size. This is pointing at our development server.

Much of this can be configured in the `playwright.config.ts` file, but if you want tests to be more specific, you can override them in the test file to be sure of what is going on at a glance.


## Running in the pipeline

During installation playwright CLI will ask to create a pipeline file to run tests on CI. This file is located in `.github/workflows/playwright.yml` if using github.

Make sure to inspect it to be sure it's running the right script.


