import { usePlan } from '../context/PlanContext.jsx';
import { formatPrice } from '../utils/format.js';
import { DISCOUNT_FROM_SPOTS } from '../rules/bookingRules.js';

// Calculated summary used on the plan and booking pages.
// It lists every selected class so the user never loses track of what they picked.
export default function BookingSummary() {
  const { planLines, totalSpots, subtotal, price } = usePlan();
  const spotsToDiscount = DISCOUNT_FROM_SPOTS - totalSpots;

  return (
    <section className="summary" aria-labelledby="summary-title">
      <h2 id="summary-title">Booking summary</h2>
      <ul className="summary-classes">
        {planLines.map((line) => (
          <li key={line.id}>
            {line.session ? `${line.session.title} (${line.session.day} ${line.session.time})` : 'Removed class'} ×{' '}
            {line.spots}
          </li>
        ))}
      </ul>
      <dl>
        <div>
          <dt>Spots</dt>
          <dd>{totalSpots}</dd>
        </div>
        <div>
          <dt>Subtotal</dt>
          <dd>{formatPrice(subtotal)}</dd>
        </div>
        <div>
          <dt>Group discount</dt>
          <dd>{price.discount > 0 ? `− ${formatPrice(price.discount)}` : 'None'}</dd>
        </div>
        <div className="total-row">
          <dt>Total</dt>
          <dd>{formatPrice(price.total)}</dd>
        </div>
      </dl>

      {!price.ok && <p className="note warning">⚠ {price.message}</p>}
      {price.ok && spotsToDiscount > 0 && totalSpots > 0 && (
        <p className="note">
          Add {spotsToDiscount} more spot{spotsToDiscount > 1 ? 's' : ''} to get 15% off.
        </p>
      )}
    </section>
  );
}
