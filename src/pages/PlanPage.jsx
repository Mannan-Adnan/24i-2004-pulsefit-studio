import { Link, useNavigate } from 'react-router-dom';
import { usePlan } from '../context/PlanContext.jsx';
import DataStatus from '../components/DataStatus.jsx';
import BookingSummary from '../components/BookingSummary.jsx';
import QuantityControl from '../components/QuantityControl.jsx';
import { formatPrice } from '../utils/format.js';
import { maxSpotsFor } from '../rules/bookingRules.js';

export default function PlanPage() {
  const navigate = useNavigate();
  const { status, plan, planLines, updateSpots, removeFromPlan, hasProblems, price, canBook } = usePlan();

  if (status !== 'ready') return <DataStatus />;

  if (plan.length === 0) {
    return (
      <div className="empty-state">
        <h1>Your plan is empty</h1>
        <p>Add one or more classes from the timetable to get started.</p>
        <Link to="/classes" className="btn primary">
          View classes
        </Link>
      </div>
    );
  }

  return (
    <>
      <h1>My plan</h1>
      <div className="two-columns">
        <section aria-label="Selected classes">
          {/* Restored plan is checked against this week's timetable. */}
          {hasProblems && (
            <p className="note error" role="alert">
              Some classes in your plan need attention before you can book.
            </p>
          )}
          <ul className="cart-list">
            {planLines.map((line) => (
              <li key={line.id} className={line.problem ? 'cart-line has-problem' : 'cart-line'}>
                <div className="cart-line-info">
                  <strong>{line.session ? line.session.title : 'Unknown class'}</strong>
                  {line.session && (
                    <span className="muted">
                      {line.session.day} {line.session.time} · {formatPrice(line.session.price)} × {line.spots} spots
                    </span>
                  )}
                  {line.problem && <span className="line-problem">⚠ {line.problem}</span>}
                </div>
                <div className="cart-line-actions">
                  {line.session && line.session.seatsLeft > 0 && (
                    <QuantityControl
                      name={line.session.title}
                      qty={line.spots}
                      max={maxSpotsFor(line.session)}
                      onChange={(spots) => updateSpots(line.id, spots)}
                    />
                  )}
                  <button type="button" className="btn small danger" onClick={() => removeFromPlan(line.id)}>
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <p>
            <Link to="/classes">← Add more classes</Link>
          </p>
        </section>

        <aside>
          <BookingSummary />
          <button type="button" className="btn primary large full" onClick={() => navigate('/book')} disabled={!canBook}>
            Continue to booking
          </button>
          {!canBook && (
            <p className="reason">{hasProblems ? 'Fix the classes marked ⚠ first.' : !price.ok ? price.message : ''}</p>
          )}
        </aside>
      </div>
    </>
  );
}
