import { usePlan } from '../context/PlanContext.jsx';

// Shown instead of a page while the timetable is loading or has failed to load.
export default function DataStatus() {
  const { status, errorMessage, retry } = usePlan();

  if (status === 'loading') {
    return (
      <div className="status-box" role="status">
        <div className="spinner" aria-hidden="true"></div>
        <p>Loading this week's classes...</p>
      </div>
    );
  }

  return (
    <div className="status-box error" role="alert">
      <h2>Timetable could not be loaded</h2>
      <p>{errorMessage}</p>
      <p className="muted">
        If you turned on "Simulate loading failure" on the Home page, turn it off first.
      </p>
      <button type="button" className="btn primary" onClick={retry}>
        Retry
      </button>
    </div>
  );
}
