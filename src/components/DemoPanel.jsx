import { usePlan } from '../context/PlanContext.jsx';

// Clearly labelled controls for testing edge cases (loading failure,
// empty data and changed availability). Settings are saved in localStorage.
export default function DemoPanel() {
  const { demo, setDemo } = usePlan();

  function handleChange(event) {
    const { name, checked } = event.target;
    setDemo((prev) => ({ ...prev, [name]: checked }));
  }

  return (
    <section className="demo-panel" aria-labelledby="demo-title">
      <h2 id="demo-title">Demo controls (for testing)</h2>
      <p className="muted">These simulate problems so the error and recovery screens can be checked.</p>
      <label className="checkbox">
        <input type="checkbox" name="failLoading" checked={demo.failLoading} onChange={handleChange} />
        Simulate loading failure (Retry fixes it)
      </label>
      <label className="checkbox">
        <input type="checkbox" name="emptySchedule" checked={demo.emptySchedule} onChange={handleChange} />
        Simulate empty timetable (no classes this week)
      </label>
      <label className="checkbox">
        <input type="checkbox" name="yogaFull" checked={demo.yogaFull} onChange={handleChange} />
        Simulate Morning Yoga Flow becoming full (changed availability)
      </label>
    </section>
  );
}
