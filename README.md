# Task UI

This repo is build based on Remix framework and Mantine UI framework.

- 📖 [Remix docs](https://remix.run/docs)
- 📖 [Maintine dev docs](https://mantine.dev/getting-started/)

## Prerequisites

- Nodejs >= 20.11.0 (Recommended to install asdf, see .tool-versions)

## Development

Initialize dependencis for node_modules

```
npm i
```

Run the dev server:

```
npm start
```

This will run the local development on localhost:8080

## Deployment

If you're familiar with deploying Node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `npm run build`

- `build/server`
- `build/client`

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever css framework you prefer. See the [Vite docs on css](https://vitejs.dev/guide/features.html#css) for more information.

However due to time constraints I chose to use Mantine framework to speed up with the UI component for a quick demo.

## Repo Structure

1. Routes - this a file naming routes configuration, meaning the route name will be directly reflect and accessible from URL. For example: `_general.tasks.index.tsx` is equal to `/tasks`
2. Components - UI components to host reusable react components
3. Lib - Helpers and hooks that help on the development like APIs, utilities and types.

This repo also using `husky` and `lint-staged` to integrate with `pre-commit` hook to run `prettier` and `eslint` before commit our local files.

For CI/CD we can have a `copilot` folder and use `github/actions` to connect up with the `Dockerfile` for deployment flow.
