// src/pages/NotFound.jsx
export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-300 dark:text-gray-700">404</h1>
        <p className="text-2xl mt-4 text-gray-600 dark:text-gray-400">Page Not Found</p>
        <a href="/" className="mt-8 inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Go Home
        </a>
      </div>
    </div>
  );
}