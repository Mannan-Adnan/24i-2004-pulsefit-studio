import { SESSIONS } from '../data/classes.js';

// Mock "server" call. It waits a little, then returns the local timetable.
// The demo settings let us show the loading, error, empty and
// changed-availability states without a real backend.
export function loadClasses(demo) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (demo.failLoading) {
        reject(new Error('Could not load the timetable (simulated network error).'));
        return;
      }
      if (demo.emptySchedule) {
        resolve([]);
        return;
      }
      // Copy the sessions so we never change the original data.
      const sessions = SESSIONS.map((session) =>
        demo.yogaFull && session.id === 'c01' ? { ...session, seatsLeft: 0 } : { ...session }
      );
      resolve(sessions);
    }, 700);
  });
}
