import { usePlan } from '../context/PlanContext.jsx';

// Asks for the user's age once, at the top of the timetable, so 16+ classes
// are marked before anything is added (fixes PulseFit problem 3: age rules
// only appeared on a later form). The age is saved in localStorage.
export default function AgeCheck() {
  const { age, ageNumber, setAge } = usePlan();

  let message = 'Some classes are 16+. Enter your age to see which ones you can book.';
  if (ageNumber !== null && ageNumber < 16) message = 'Classes marked "Not for your age" are 16+ and can’t be added.';
  if (ageNumber !== null && ageNumber >= 16) message = 'You can join every class on the timetable.';

  return (
    <section className="age-check" aria-labelledby="age-check-title">
      <h2 id="age-check-title">Check which classes you can join</h2>
      <div className="age-check-row">
        <label htmlFor="your-age">Your age</label>
        <input
          id="your-age"
          type="number"
          inputMode="numeric"
          min="10"
          max="80"
          value={age}
          onChange={(event) => setAge(event.target.value)}
          aria-describedby="age-check-help"
        />
        <p id="age-check-help" className="muted" aria-live="polite">
          {message}
        </p>
      </div>
    </section>
  );
}
