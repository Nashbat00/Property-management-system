import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center text-center px-4">
      <div>
        <p className="text-6xl font-bold text-primary-600">404</p>
        <p className="mt-3 text-gray-600">The page you are looking for does not exist.</p>
        <Link to="/" className="btn-primary inline-block mt-6">
          Go home
        </Link>
      </div>
    </div>
  );
}
