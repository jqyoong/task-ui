export const loader = () => {
  const robotsTxt = `User-agent: *
Disallow: /
`;
  return new Response(robotsTxt, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
    },
  });
};
