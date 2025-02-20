/**
 * DO NOT PLACE the encrypted environment variables here as this will be shared with the browser code via Remix
 * loader's useLoaderData().
 */
export default (): Partial<NodeJS.ProcessEnv> => ({
  API_BASE_URL: process.env.API_BASE_URL,
  NODE_ENV: process.env.NODE_ENV,
});
