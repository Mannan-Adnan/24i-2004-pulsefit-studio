import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePlan } from '../context/PlanContext.jsx';
import DataStatus from '../components/DataStatus.jsx';
import BookingSummary from '../components/BookingSummary.jsx';
import { validateBooking } from '../utils/validation.js';

export default function BookPage() {
  const navigate = useNavigate();
  const { status, canBook, planSessions, confirmBooking, age } = usePlan();
  // The age entered on the timetable is filled in for the user.
  const [form, setForm] = useState({ name: '', phone: '', age, healthConfirmed: false });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false); // true right after confirming

  if (status !== 'ready') return <DataStatus />;

  // Someone opened /book directly with an empty or invalid plan.
  // (Skipped right after submitting, because the plan is emptied while we move to /confirmation.)
  if (!canBook && !submitted) {
    return (
      <div className="empty-state">
        <h1>Your plan isn't ready to book</h1>
        <p>Your plan is empty, has too many spots, or has classes that need fixing.</p>
        <Link to="/plan" className="btn primary">
          Go to my plan
        </Link>
      </div>
    );
  }

  // One handler for every input. Checkboxes use "checked" instead of "value".
  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function handleSubmit(event) {
    event.preventDefault(); // stop the browser reloading the page
    const newErrors = validateBooking(form, planSessions);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return; // keep all typed values

    setSubmitted(true);
    confirmBooking(form);
    navigate('/confirmation');
  }

  return (
    <>
      <h1>Book your classes</h1>
      <div className="two-columns">
        <form className="checkout-form" onSubmit={handleSubmit} noValidate>
          <p className="note">Simulated booking: please use fake details. No payment is taken.</p>

          <div className="field">
            <label htmlFor="name">Full name</label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              aria-invalid={Boolean(errors.name)}
              aria-describedby="name-error"
            />
            {errors.name && <p id="name-error" className="field-error">{errors.name}</p>}
          </div>

          <div className="field">
            <label htmlFor="phone">Mobile number</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              inputMode="numeric"
              placeholder="03001234567"
              value={form.phone}
              onChange={handleChange}
              aria-invalid={Boolean(errors.phone)}
              aria-describedby="phone-error"
            />
            {errors.phone && <p id="phone-error" className="field-error">{errors.phone}</p>}
          </div>

          <div className="field">
            <label htmlFor="age">Age of youngest person attending</label>
            <input
              id="age"
              name="age"
              type="number"
              inputMode="numeric"
              min="10"
              max="80"
              value={form.age}
              onChange={handleChange}
              aria-invalid={Boolean(errors.age)}
              aria-describedby="age-hint age-error"
            />
            <p id="age-hint" className="muted hint">Classes marked 16+ need everyone to be 16 or older.</p>
            {errors.age && <p id="age-error" className="field-error">{errors.age}</p>}
          </div>

          <div className="field">
            <label className="checkbox">
              <input
                type="checkbox"
                name="healthConfirmed"
                checked={form.healthConfirmed}
                onChange={handleChange}
                aria-invalid={Boolean(errors.healthConfirmed)}
                aria-describedby="health-error"
              />
              I confirm everyone attending is fit to exercise
            </label>
            {errors.healthConfirmed && (
              <p id="health-error" className="field-error">
                {errors.healthConfirmed}
              </p>
            )}
          </div>

          <button type="submit" className="btn primary large full">
            Confirm simulated booking
          </button>
        </form>

        <aside>
          <BookingSummary />
          <p>
            <Link to="/plan">← Edit plan</Link>
          </p>
        </aside>
      </div>
    </>
  );
}
