import { Link } from 'react-router-dom';
import { usePlan } from '../context/PlanContext.jsx';
import { formatPrice } from '../utils/format.js';

// Sticky bar at the bottom of the timetable and class pages. It always lists
// the classes the user has chosen, so the selection is never lost on the way
// to booking (fixes PulseFit problem 2).
export default function PlanBar() {
  const { planLines, totalSpots, price, hasProblems } = usePlan();

  if (planLines.length === 0) return null;

  return (
    <aside className="plan-bar" aria-label="Your plan">
      <div className="plan-bar-inner">
        <div className="plan-bar-text">
          <strong>
            Your plan: {planLines.length} {planLines.length === 1 ? 'class' : 'classes'} · {totalSpots}{' '}
            {totalSpots === 1 ? 'spot' : 'spots'} · {formatPrice(price.total)}
          </strong>
          <span>
            {planLines
              .map((line) => (line.session ? `${line.session.title} (${line.session.day} ${line.session.time})` : 'Removed class'))
              .join(' · ')}
          </span>
          {hasProblems && <span className="plan-bar-warning">⚠ Something in your plan needs attention</span>}
        </div>
        <Link to="/plan" className="btn primary">
          Review plan →
        </Link>
      </div>
    </aside>
  );
}
