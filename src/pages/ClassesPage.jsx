import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { usePlan } from '../context/PlanContext.jsx';
import { CLASS_TYPES, DAYS, DAY_NAMES, LEVELS } from '../data/classes.js';
import ClassRow from '../components/ClassRow.jsx';
import AgeCheck from '../components/AgeCheck.jsx';
import PlanBar from '../components/PlanBar.jsx';
import DataStatus from '../components/DataStatus.jsx';

export default function ClassesPage() {
  const { sessions, status, ageNumber, addToPlan, getSpotsInPlan } = usePlan();

  // Search, filter and sort live in the URL (e.g. /classes?type=Yoga).
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('q') || '';
  const type = searchParams.get('type') || 'All';
  const level = searchParams.get('level') || 'All';
  const sort = searchParams.get('sort') || 'time';

  function updateParam(key, value, defaultValue) {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value === defaultValue) next.delete(key);
        else next.set(key, value);
        return next;
      },
      { replace: true }
    );
  }

  // The search box keeps its own text so every key shows instantly.
  // (The URL updates a moment later, so reading the box straight from the URL
  // could drop letters when typing fast.)
  const [searchText, setSearchText] = useState(search);

  // When the URL changes from somewhere else (Back button, "Show all classes"),
  // copy the new search into the box.
  useEffect(() => {
    setSearchText(search);
  }, [search]);

  function handleSearchChange(event) {
    setSearchText(event.target.value);
    updateParam('q', event.target.value, '');
  }

  if (status !== 'ready') return <DataStatus />;

  // 1. search  2. filter  3. sort  - all work together
  const text = searchText.trim().toLowerCase();
  const filtered = sessions.filter((session) => {
    const matchesSearch =
      session.title.toLowerCase().includes(text) ||
      session.instructor.toLowerCase().includes(text) ||
      session.type.toLowerCase().includes(text);
    const matchesType = type === 'All' || session.type === type;
    const matchesLevel = level === 'All' || session.level === level;
    return matchesSearch && matchesType && matchesLevel;
  });

  // Sorting happens inside each day, because the timetable is grouped by day.
  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'price-low') return a.price - b.price;
    if (sort === 'seats') return b.seatsLeft - a.seatsLeft;
    return a.time.localeCompare(b.time); // 'time': "07:00" comes before "18:30"
  });

  return (
    <>
      <h1>This week's timetable</h1>
      <AgeCheck />

      <form className="filters filters-4" role="search" onSubmit={(event) => event.preventDefault()}>
        <div className="field">
          <label htmlFor="search">Search</label>
          <input
            id="search"
            type="search"
            placeholder="Class, type or instructor"
            value={searchText}
            onChange={handleSearchChange}
          />
        </div>
        <div className="field">
          <label htmlFor="type">Class type</label>
          <select id="type" value={type} onChange={(event) => updateParam('type', event.target.value, 'All')}>
            {CLASS_TYPES.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="level">Level</label>
          <select id="level" value={level} onChange={(event) => updateParam('level', event.target.value, 'All')}>
            {LEVELS.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="sort">Sort each day by</label>
          <select id="sort" value={sort} onChange={(event) => updateParam('sort', event.target.value, 'time')}>
            <option value="time">Start time</option>
            <option value="price-low">Price: low to high</option>
            <option value="seats">Most seats left</option>
          </select>
        </div>
      </form>

      {sessions.length === 0 ? (
        <div className="empty-state">
          <h2>No classes are scheduled this week</h2>
          <p>The new timetable is published every Sunday evening. Please check back then.</p>
        </div>
      ) : sorted.length === 0 ? (
        <div className="empty-state" role="status">
          <h2>No classes match your filters</h2>
          <p>There are {sessions.length} classes this week, but none match. Try a different type or level.</p>
          <button type="button" className="btn primary" onClick={() => setSearchParams({}, { replace: true })}>
            Show all classes
          </button>
        </div>
      ) : (
        <>
          <p className="result-count" role="status">
            Showing {sorted.length} of {sessions.length} classes
          </p>
          {/* Timetable grouped by day: Monday, Tuesday, ... */}
          {DAYS.map((day) => {
            const daySessions = sorted.filter((session) => session.day === day);
            if (daySessions.length === 0) return null;
            return (
              <section key={day} className="day-block" aria-labelledby={`day-${day}`}>
                <h2 id={`day-${day}`}>{DAY_NAMES[day]}</h2>
                <ul className="schedule">
                  {daySessions.map((session) => (
                    <ClassRow
                      key={session.id}
                      session={session}
                      inPlan={getSpotsInPlan(session.id) > 0}
                      ageNumber={ageNumber}
                      onAdd={addToPlan}
                    />
                  ))}
                </ul>
              </section>
            );
          })}
        </>
      )}

      <PlanBar />
    </>
  );
}
