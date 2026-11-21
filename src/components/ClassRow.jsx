import { Link } from 'react-router-dom';
import SeatsBadge from './SeatsBadge.jsx';
import { formatPrice } from '../utils/format.js';
import { checkAge } from '../rules/bookingRules.js';

// One row of the timetable. Every row shows what is needed to choose a class:
// time, duration, level, age limit, price and seats left
// (fixes PulseFit problem 1: timetables that hide price, level and seats).
export default function ClassRow({ session, inPlan, ageNumber, onAdd }) {
  const isFull = session.seatsLeft === 0;
  const ageOk = checkAge(session, ageNumber).ok;

  return (
    <li className={isFull || !ageOk ? 'class-row unavailable' : 'class-row'}>
      <div className="row-time">
        <strong>{session.time}</strong>
        <span>{session.durationMin} min</span>
      </div>

      <div className="row-main">
        <h3>
          <Link to={`/classes/${session.id}`}>{session.title}</Link>
        </h3>
        <p className="muted">
          {session.type} · {session.instructor}
        </p>
        <p className="tags">
          <span className="tag">{session.level}</span>
          {session.minAge > 0 && <span className="tag age">{session.minAge}+</span>}
          {!ageOk && <span className="tag soldout">Not for your age</span>}
        </p>
      </div>

      <div className="row-price">
        <strong>{formatPrice(session.price)}</strong>
        <span>per spot</span>
      </div>

      <div className="row-seats">
        <SeatsBadge seatsLeft={session.seatsLeft} />
      </div>

      <div className="row-action">
        {inPlan ? (
          <span className="in-cart">✓ In plan</span>
        ) : (
          <button
            type="button"
            className="btn primary"
            onClick={() => onAdd(session.id)}
            disabled={isFull || !ageOk}
            aria-label={`Add ${session.title} to plan`}
          >
            Add
          </button>
        )}
      </div>
    </li>
  );
}
