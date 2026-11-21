import { checkAge } from '../rules/bookingRules.js';

// Checks the booking form. Returns an object like { phone: 'message' }.
// An empty object means the form is valid.
// planSessions = the classes in the plan, used for the age rule (Rule 2).
export function validateBooking(form, planSessions) {
  const errors = {};

  if (form.name.trim().length < 3) {
    errors.name = 'Enter your name (at least 3 letters).';
  }

  // Pakistani mobile number: 11 digits starting with 03, e.g. 03001234567
  if (!/^03\d{9}$/.test(form.phone.trim())) {
    errors.phone = 'Enter an 11-digit mobile number starting with 03, e.g. 03001234567.';
  }

  const age = Number(form.age);
  if (form.age === '' || !Number.isInteger(age) || age < 10 || age > 80) {
    errors.age = 'Enter your age as a whole number between 10 and 80.';
  } else {
    // Age is valid: now check it against every class in the plan.
    const tooYoung = planSessions.find((session) => !checkAge(session, age).ok);
    if (tooYoung) {
      errors.age = checkAge(tooYoung, age).message;
    }
  }

  if (!form.healthConfirmed) {
    errors.healthConfirmed = 'Please confirm you are fit to take part.';
  }

  return errors;
}
