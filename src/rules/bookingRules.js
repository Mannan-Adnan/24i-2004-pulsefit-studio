// Business rules for PulseFit Studio.
// Plain JavaScript functions (no React) so the same code is used by the app
// AND by the automated test in tests/bookingRules.test.js.

// ----- Rule 1: Capacity -----
export const MAX_SPOTS_PER_CLASS = 4; // one person can book 1-4 spots in a class

/** Spots for one class must be 1-4 and not more than the seats left. */
export function checkSpots(session, spots) {
  if (session.seatsLeft === 0) {
    return { ok: false, message: `${session.title} is full.` };
  }
  if (spots > MAX_SPOTS_PER_CLASS) {
    return { ok: false, message: `You can book at most ${MAX_SPOTS_PER_CLASS} spots in one class.` };
  }
  if (spots > session.seatsLeft) {
    return { ok: false, message: `Only ${session.seatsLeft} seats left in ${session.title}. Reduce your spots.` };
  }
  return { ok: true, message: '' };
}

/** Highest number of spots the user may pick for this class. */
export function maxSpotsFor(session) {
  return Math.min(MAX_SPOTS_PER_CLASS, session.seatsLeft);
}

// ----- Rule 2: Eligibility (age) -----
/**
 * Classes with minAge 16 can't be booked by anyone younger.
 * age = a number, or null when the user hasn't entered an age yet.
 */
export function checkAge(session, age) {
  if (age !== null && session.minAge > 0 && age < session.minAge) {
    return { ok: false, message: `${session.title} is for ages ${session.minAge}+. Remove it from your plan to continue.` };
  }
  return { ok: true, message: '' };
}

// ----- Rule 3: Pricing (group discount + booking limit) -----
export const DISCOUNT_FROM_SPOTS = 3; // 3 or more spots in total get a discount
export const DISCOUNT_RATE = 0.15; // 15% off
export const MAX_SPOTS_PER_BOOKING = 8; // one booking can't have more than 8 spots

/**
 * Calculates the price for the whole booking.
 * Returns { ok, discount, total, message } so it can be tested without the UI.
 */
export function calculateBookingPrice(subtotal, totalSpots) {
  if (totalSpots > MAX_SPOTS_PER_BOOKING) {
    return {
      ok: false,
      discount: 0,
      total: subtotal,
      message: `One booking can have at most ${MAX_SPOTS_PER_BOOKING} spots. You have ${totalSpots}.`,
    };
  }
  const discount = totalSpots >= DISCOUNT_FROM_SPOTS ? Math.round(subtotal * DISCOUNT_RATE) : 0;
  return { ok: true, discount, total: subtotal - discount, message: '' };
}

/**
 * Checks one plan line against the current timetable.
 * Returns an error message, or '' when the line is fine.
 */
export function getLineProblem(session, spots, age) {
  if (!session) return 'This class is no longer on the timetable. Please remove it.';
  const spotsCheck = checkSpots(session, spots);
  if (!spotsCheck.ok) return spotsCheck.message;
  return checkAge(session, age).message;
}
