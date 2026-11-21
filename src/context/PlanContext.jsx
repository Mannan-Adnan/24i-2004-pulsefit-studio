import { createContext, useContext, useEffect, useState } from 'react';
import { loadClasses } from '../api/loadClasses.js';
import { readStorage, writeStorage } from '../utils/storage.js';
import { calculateBookingPrice, getLineProblem } from '../rules/bookingRules.js';

// One shared place for the timetable data and the user's plan (selected classes).
// Every page reads from here, so the timetable, class page, plan and booking always agree.
const PlanContext = createContext(null);

const DEFAULT_DEMO = { failLoading: false, emptySchedule: false, yogaFull: false };

export function PlanProvider({ children }) {
  // ----- Timetable data (loaded asynchronously) -----
  const [sessions, setSessions] = useState([]);
  const [status, setStatus] = useState('loading'); // 'loading' | 'ready' | 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const [reloadCount, setReloadCount] = useState(0);

  // ----- Saved in localStorage so they survive a page refresh -----
  const [plan, setPlan] = useState(() => readStorage('pulsefit-plan', [])); // [{ id, spots }]
  const [demo, setDemo] = useState(() => readStorage('pulsefit-demo', DEFAULT_DEMO));
  // The user's age, entered once on the timetable so age limits are checked up front.
  const [age, setAge] = useState(() => readStorage('pulsefit-age', '')); // text from the input
  const ageNumber = age === '' ? null : Number(age);

  // Kept in memory only, so personal details are not stored in the browser.
  const [lastBooking, setLastBooking] = useState(null);

  // Load the timetable whenever the demo settings change or the user presses Retry.
  useEffect(() => {
    let ignore = false; // cleanup flag: ignore an old request if a newer one started
    setStatus('loading');
    loadClasses(demo)
      .then((data) => {
        if (!ignore) {
          setSessions(data);
          setStatus('ready');
        }
      })
      .catch((error) => {
        if (!ignore) {
          setErrorMessage(error.message);
          setStatus('error');
        }
      });
    return () => {
      ignore = true;
    };
  }, [demo, reloadCount]);

  // Save to localStorage whenever these values change.
  useEffect(() => writeStorage('pulsefit-plan', plan), [plan]);
  useEffect(() => writeStorage('pulsefit-demo', demo), [demo]);
  useEffect(() => writeStorage('pulsefit-age', age), [age]);

  // ----- Plan actions (never mutate state; always create new arrays) -----
  function addToPlan(id) {
    setPlan((prev) => {
      if (prev.some((line) => line.id === id)) return prev; // already in the plan
      return [...prev, { id, spots: 1 }];
    });
  }

  function updateSpots(id, spots) {
    if (spots <= 0) {
      removeFromPlan(id);
      return;
    }
    setPlan((prev) => prev.map((line) => (line.id === id ? { ...line, spots } : line)));
  }

  function removeFromPlan(id) {
    setPlan((prev) => prev.filter((line) => line.id !== id));
  }

  function retry() {
    // Demo: Retry also turns off "Simulate loading failure", as if the connection came back.
    setDemo((prev) => ({ ...prev, failLoading: false }));
    setReloadCount((count) => count + 1);
  }

  // ----- Derived values (calculated from the current state on every render) -----
  const planLines = plan.map((line) => {
    const session = sessions.find((s) => s.id === line.id);
    const problem = status === 'ready' ? getLineProblem(session, line.spots, ageNumber) : '';
    return { ...line, session, problem };
  });

  const planSessions = planLines.filter((line) => line.session).map((line) => line.session);
  const totalSpots = plan.reduce((sum, line) => sum + line.spots, 0);
  const subtotal = planLines.reduce((sum, line) => (line.session ? sum + line.session.price * line.spots : sum), 0);
  const price = calculateBookingPrice(subtotal, totalSpots); // { ok, discount, total, message }
  const hasProblems = planLines.some((line) => line.problem !== '');
  const canBook = status === 'ready' && plan.length > 0 && !hasProblems && price.ok;

  function getSpotsInPlan(id) {
    const line = plan.find((planLine) => planLine.id === id);
    return line ? line.spots : 0;
  }

  // Simulated booking: save a summary, then empty the plan.
  function confirmBooking(form) {
    const booking = {
      number: 'PF-' + String(Date.now()).slice(-6),
      name: form.name.trim(),
      lines: planLines.map(({ id, spots, session }) => ({
        id,
        spots,
        title: session.title,
        when: `${session.day} ${session.time}`,
        price: session.price,
      })),
      subtotal,
      discount: price.discount,
      total: price.total,
    };
    setLastBooking(booking);
    setPlan([]);
  }

  const value = {
    sessions,
    status,
    errorMessage,
    retry,
    plan,
    planLines,
    planSessions,
    totalSpots,
    subtotal,
    price,
    hasProblems,
    canBook,
    getSpotsInPlan,
    addToPlan,
    updateSpots,
    removeFromPlan,
    demo,
    setDemo,
    age,
    ageNumber,
    setAge,
    lastBooking,
    confirmBooking,
  };

  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>;
}

// Custom hook so components can write: const { plan } = usePlan();
export function usePlan() {
  return useContext(PlanContext);
}
