# PulseFit Studio: Fitness Class Booking (CS4032 Assignment 02)

**Student:** Mannan bin Adnan · 24I-2004 · _Section_
**GitHub:** _add repository link_ · **Live site:** _add deployment link_

## Description
PulseFit Studio is a fictional group-fitness studio in F-10 Markaz, Islamabad, for working adults and students. Users can browse the weekly timetable, search and filter it, open a class, build a plan of classes with 1–4 spots each, enter their details and confirm a **simulated** booking. No account is needed.

## Commands
| Task | Command |
|---|---|
| Install | `npm install` |
| Run locally | `npm run dev`, then open the printed URL (usually http://localhost:5173) |
| Build | `npm run build` (output in `dist/`) |
| Preview the build | `npm run preview` |
| Run the rule test | `npm test` (runs `node --test`) |

Requires Node.js 20 or newer.

## Routes
| Route | Purpose |
|---|---|
| `/` | Home page: about the studio, how booking works, demo controls |
| `/classes` | Day-by-day timetable with the "Your age" check, search, type and level filters, sort within each day, and the sticky plan bar |
| `/classes/:id` | Class details (e.g. `/classes/c03`). An unknown id shows "Class not found" |
| `/plan` | Selected classes: change spots, remove classes, see problems and the summary |
| `/book` | Booking form (name, phone, age, fitness confirmation) with validation |
| `/confirmation` | Simulated booking confirmation |
| any other | "Page not found" page |

## Features
- 12 classes loaded through an async mock loader (`src/api/loadClasses.js`) with loading, error and Retry states.
- Search, filter and sort all work together.
- Timetable grouped by day. Every row shows time, duration, level, 16+, price and seats left.
- "Your age" box marks classes you can't join before you add them. The age is saved and pre-filled on the booking form.
- The plan is shared across all pages, saved in localStorage and always visible in a sticky bar.
- Three business rules (see below) block invalid booking.
- The summary shows spots, subtotal, group discount and total.
- Responsive at 390px and 1280px. Keyboard accessible with visible focus.

## Business rules
1. **Capacity:** 1–4 spots per class, never more than the seats left. Full classes can't be added.
2. **Eligibility:** classes marked 16+ can't be added or booked if the age entered is under 16 (checked on the timetable, class page, plan and booking form).
3. **Pricing:** 15% off when the plan has **3 or more** spots in total. One booking can have at most **8** spots.

## Reproducing the edge cases
All demo controls are on the **Home page** under "Demo controls".
| Case | How to reproduce |
|---|---|
| Loading failure | Tick "Simulate loading failure" → open Classes → error message. Untick it → press **Retry** |
| Empty dataset | Tick "Simulate empty timetable" → Classes shows "No classes are scheduled this week" |
| No search matches | Search `xyz` → "No classes match your filters" with a **Show all classes** button |
| Invalid URL | Open `/classes/abc` or `/anything` |
| Changed availability | Add Morning Yoga Flow → tick "Simulate Morning Yoga Flow becoming full" → My plan flags it and blocks booking |
| Restored selection | Add classes, refresh the page: the plan is restored and re-checked against the timetable |
| Capacity limit | Advanced Boxing has 2 seats: + stops at 2. Other classes stop at 4 |
| Booking limit | Add 3 classes with 3 spots each (9 spots) → "at most 8 spots" and booking is disabled |
| Age rule | On /classes enter age 15 → 16+ classes show "Not for your age" and can't be added. Age 16 → allowed |
| Age changed after adding | Enter 20, add HIIT Burn, change age to 15 → My plan flags HIIT Burn and blocks booking |
| Missing image or info | "Power Yoga" has no picture, and "Family Zumba" has no description |
| Long content | The "Weekend Long Ride…" class has a very long title that wraps |
| Invalid form | Submit with phone `123` and no checkbox: specific errors appear and the other values are kept |

## Simulated operations and limitations
- No real bookings, payments, accounts or backend. All data is local (`src/data/classes.js`).
- Seats don't go down after a booking. The timetable is a fixed sample week (no real dates).
- The confirmation is kept in memory only, so refreshing `/confirmation` shows "No recent booking" (on purpose, so personal details are not saved).

## Concept map
| Concept | File | Component / function |
|---|---|---|
| Routing, URL params | `src/router.jsx`, `src/pages/ClassPage.jsx` | `router`, `useParams` |
| Search params in URL | `src/pages/ClassesPage.jsx` | `useSearchParams`, `updateParam` |
| Shared state (context) | `src/context/PlanContext.jsx` | `PlanProvider`, `usePlan` |
| useState / functional updates | `src/context/PlanContext.jsx` | `addToPlan`, `retry` |
| Immutable array updates | `src/context/PlanContext.jsx` | `addToPlan`, `updateSpots`, `removeFromPlan` |
| Immutable object updates | `src/pages/BookPage.jsx` | `handleChange` |
| useEffect + cleanup | `src/context/PlanContext.jsx` | timetable-loading effect (`ignore` flag) |
| Async / Promises | `src/api/loadClasses.js` | `loadClasses` |
| localStorage | `src/utils/storage.js`, `src/context/PlanContext.jsx` | `readStorage`, `writeStorage` (plan, age, demo) |
| Props + callback props | `src/components/ClassRow.jsx`, `QuantityControl.jsx` | `onAdd`, `onChange` |
| Lists and keys | `src/pages/ClassesPage.jsx`, `PlanPage.jsx` | `.map(... key={session.id})` |
| Conditional rendering | `src/components/DataStatus.jsx`, `ClassesPage.jsx` | loading/error/empty states |
| Derived values | `src/context/PlanContext.jsx` | `totalSpots`, `subtotal`, `price`, `canBook` |
| Controlled form + validation | `src/pages/BookPage.jsx`, `src/utils/validation.js` | `validateBooking` |
| Business rules | `src/rules/bookingRules.js` | `checkSpots`, `checkAge`, `calculateBookingPrice` |
| Automated test | `tests/bookingRules.test.js` | tests `calculateBookingPrice` |

## Deployment (Vercel)
1. Push this folder to a **public GitHub repository** (this folder must be the repository root).
2. On vercel.com: **Add New → Project → Import** the repository. Vercel reads `vercel.json`:
   - Framework: Vite · Install: `npm install` · Build: `npm run build` · Output: `dist`
3. Press **Deploy**. Every later `git push` redeploys automatically.

`vercel.json` also sends every route to `index.html`, so direct links and refreshes on nested routes (e.g. `/classes/c03`) work.
