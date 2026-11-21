import { Link } from 'react-router-dom';
import DemoPanel from '../components/DemoPanel.jsx';
import { DISCOUNT_FROM_SPOTS, MAX_SPOTS_PER_BOOKING, MAX_SPOTS_PER_CLASS } from '../rules/bookingRules.js';

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <h1>Find your class. Book in a minute.</h1>
        <p>
          PulseFit Studio runs yoga, HIIT, boxing, Zumba, spin and pilates classes in F-10 Markaz, Islamabad, for
          working adults and students.
        </p>
        <Link to="/classes" className="btn primary large">
          View this week's timetable
        </Link>
      </section>

      <section className="steps" aria-labelledby="how-title">
        <h2 id="how-title">How booking works</h2>
        <ol>
          <li>Enter your age on the timetable. Classes you can't join are marked straight away.</li>
          <li>
            Add classes to your plan and choose 1–{MAX_SPOTS_PER_CLASS} spots each. Your plan stays visible at the
            bottom of the screen.
          </li>
          <li>
            Book {DISCOUNT_FROM_SPOTS} or more spots for 15% off (up to {MAX_SPOTS_PER_BOOKING} spots per booking). Then
            confirm a simulated booking.
          </li>
        </ol>
      </section>

      <DemoPanel />
    </>
  );
}
