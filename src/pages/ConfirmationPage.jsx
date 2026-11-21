import { Link } from 'react-router-dom';
import { usePlan } from '../context/PlanContext.jsx';
import { formatPrice } from '../utils/format.js';

export default function ConfirmationPage() {
  const { lastBooking } = usePlan();

  // Opened directly, or refreshed: the booking is not stored, so explain that.
  if (!lastBooking) {
    return (
      <div className="empty-state">
        <h1>No recent booking</h1>
        <p>We couldn't find a booking from this visit. Bookings are not saved after a page refresh.</p>
        <Link to="/classes" className="btn primary">
          Browse classes
        </Link>
      </div>
    );
  }

  return (
    <section className="confirmation">
      <p className="success-icon" aria-hidden="true">
        ✓
      </p>
      <h1>Booking confirmed (simulated)</h1>
      <p>
        Thanks, {lastBooking.name}! Your booking number is <strong>{lastBooking.number}</strong>. Please arrive 10
        minutes early at PulseFit Studio, F-10 Markaz.
      </p>

      <table className="order-table">
        <caption>Booking details</caption>
        <thead>
          <tr>
            <th scope="col">Class</th>
            <th scope="col">When</th>
            <th scope="col">Spots</th>
            <th scope="col">Price</th>
          </tr>
        </thead>
        <tbody>
          {lastBooking.lines.map((line) => (
            <tr key={line.id}>
              <td>{line.title}</td>
              <td>{line.when}</td>
              <td>{line.spots}</td>
              <td>{formatPrice(line.price * line.spots)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="3">Group discount</td>
            <td>{lastBooking.discount > 0 ? `− ${formatPrice(lastBooking.discount)}` : 'None'}</td>
          </tr>
          <tr>
            <th scope="row" colSpan="3">
              Total
            </th>
            <td>
              <strong>{formatPrice(lastBooking.total)}</strong>
            </td>
          </tr>
        </tfoot>
      </table>

      <p className="note">This is a student project. No class has been reserved and no payment was taken.</p>
      <Link to="/classes" className="btn primary">
        Book more classes
      </Link>
    </section>
  );
}
