import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="empty-state">
      <h1>Page not found</h1>
      <p>This page doesn't exist. Check the address, or go back to the timetable.</p>
      <Link to="/classes" className="btn primary">
        Go to classes
      </Link>
    </div>
  );
}
