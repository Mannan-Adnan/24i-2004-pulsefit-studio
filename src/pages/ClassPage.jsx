import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { usePlan } from '../context/PlanContext.jsx';
import DataStatus from '../components/DataStatus.jsx';
import ClassImage from '../components/ClassImage.jsx';
import SeatsBadge from '../components/SeatsBadge.jsx';
import QuantityControl from '../components/QuantityControl.jsx';
import PlanBar from '../components/PlanBar.jsx';
import { formatPrice } from '../utils/format.js';
import { checkAge, maxSpotsFor, MAX_SPOTS_PER_CLASS } from '../rules/bookingRules.js';

export default function ClassPage() {
  const { id } = useParams(); // the :id part of /classes/:id
  const navigate = useNavigate();
  const location = useLocation();
  const { sessions, status, ageNumber, addToPlan, updateSpots, getSpotsInPlan } = usePlan();

  if (status !== 'ready') return <DataStatus />;

  const session = sessions.find((s) => s.id === id);

  // Invalid id in the URL, e.g. /classes/abc
  if (!session) {
    return (
      <div className="empty-state">
        <h1>Class not found</h1>
        <p>There is no class with the code "{id}". It may have been removed from this week's timetable.</p>
        <Link to="/classes" className="btn primary">
          See all classes
        </Link>
      </div>
    );
  }

  const spots = getSpotsInPlan(session.id);
  const ageCheck = checkAge(session, ageNumber); // uses the age saved on the timetable

  // Go back to the timetable the user came from (keeps their filters). If they
  // opened this page directly, there is no previous page, so go to /classes instead.
  function goBack() {
    if (location.key === 'default') navigate('/classes');
    else navigate(-1);
  }

  return (
    <article className="details">
      <button type="button" className="btn link" onClick={goBack}>
        ← Back to timetable
      </button>

      <div className="details-layout">
        <ClassImage emoji={session.emoji} title={session.title} large />
        <div>
          <p className="when">
            {session.day} · {session.time} · {session.durationMin} min
          </p>
          <h1>{session.title}</h1>
          <p className="muted">
            {session.type} with {session.instructor}
          </p>
          <p className="tags">
            <span className="tag">{session.level}</span>
            {session.minAge > 0 && <span className="tag age">{session.minAge}+ only</span>}
            <SeatsBadge seatsLeft={session.seatsLeft} />
          </p>
          <p className="price large">{formatPrice(session.price)} per spot</p>
          <p>{session.description || 'No description available for this class yet.'}</p>

          <ul className="rule-list">
            <li>
              Book 1–{MAX_SPOTS_PER_CLASS} spots (for you and friends). {session.seatsLeft} seats left.
            </li>
            {session.minAge > 0 ? (
              <li>Everyone attending must be {session.minAge} or older.</li>
            ) : (
              <li>Open to all ages (under 16 with a parent).</li>
            )}
          </ul>

          {/* Age is checked here, before adding (not later on the form). */}
          {!ageCheck.ok && <p className="note error">⚠ {ageCheck.message}</p>}
          {ageNumber === null && session.minAge > 0 && (
            <p className="note warning">
              This class is {session.minAge}+. Enter your age on the <Link to="/classes">timetable</Link> to check.
            </p>
          )}

          {session.seatsLeft === 0 ? (
            <p className="note error">This class is full. Try another {session.type} class on the timetable.</p>
          ) : spots === 0 ? (
            <button
              type="button"
              className="btn primary large"
              onClick={() => addToPlan(session.id)}
              disabled={!ageCheck.ok}
            >
              Add to my plan
            </button>
          ) : (
            <div className="in-cart-box">
              <p>Spots in your plan:</p>
              <QuantityControl
                name={session.title}
                qty={spots}
                max={maxSpotsFor(session)}
                onChange={(value) => updateSpots(session.id, value)}
              />
              <Link to="/plan" className="btn primary">
                Review my plan
              </Link>
            </div>
          )}
        </div>
      </div>
      <PlanBar />
    </article>
  );
}
