import { Link } from '@remix-run/react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <h1 className="text-6xl font-bold text-red-500">404</h1>
      <h2 className="text-2xl font-semibold mt-4">Page Not Found</h2>
      <p className="text-lg text-gray-600 mt-2">Sorry, the page you are looking for does not exist.</p>
      <Link to="/" className="mt-6 px-6 py-3 bg-blue-500 text-white font-medium rounded hover:bg-blue-600 transition">
        Go Back Home
      </Link>
    </div>
  );
}
