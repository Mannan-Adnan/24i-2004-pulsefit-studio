# Frontend Decisions: PulseFit Studio

## Decision 1: Day-by-day timetable with full details in every row (information hierarchy)
| Field | Content |
|---|---|
| **Problem** | barrys.com/schedule/pasadena shows time, class and instructor, but no price or level. Prices are on a separate Pricing tab (`barrys_01`, `barrys_05`). The 1rebel.com/en-gb/reserve rows show no duration, price or spots left. Only full classes change to "Waitlist" (`1rebel_01`). |
| **Decision** | The timetable is grouped by day (Monday, Tuesday…). Each class is one row with fixed columns: **time + duration · class, type, instructor, level, 16+ · price per spot · seats left · Add**. Seats use text plus colour ("Only 2 seats left", "Full"). |
| **Alternative** | A card grid with only time and name, and all details on the class page. |
| **Reason** | People plan workouts around their week, so grouping by day matches how they think. Having price and seats in the same column on every row makes classes easy to compare at a glance. |
| **Tradeoff** | Rows hold a lot of information. On a 390px phone they stack into two columns, so each row is taller and the week needs more scrolling. |
| **Code location** | `src/pages/ClassesPage.jsx` (the `DAYS.map` grouping), `src/components/ClassRow.jsx`, `src/components/SeatsBadge.jsx` |
| **Evidence** | 1. Open /classes. 2. Under "Monday", each row shows time, duration, level, price and seats. "Spin Express" (Wednesday) shows "Full" and its Add button is disabled. _(add screenshot)_ |

## Decision 2: Sticky "Your plan" bar keeps the chosen classes in view (interaction / state)
| Field | Content |
|---|---|
| **Problem** | On barrys.com, every class card links to the same `/book-now?location=9658`. After choosing Mon 8:45, the next two pages never show which class was chosen (`barrys_02a`–`02c`). |
| **Decision** | Chosen classes are stored in one shared plan state (React context) and saved in localStorage. A **sticky bar at the bottom** of the timetable and class pages always lists them by name, day and time, with spots and the live total. The Booking summary repeats the list next to the booking form. |
| **Alternative** | Pass a single class ID through the URL to a booking page (`/book/c03`), allowing one class per booking. |
| **Reason** | Users often book a few classes in one go. Seeing the plan at every step confirms the right classes are selected, right up to the final button. |
| **Tradeoff** | The sticky bar covers part of the screen, especially on mobile. A saved plan can also go out of date (e.g. a class fills up), so it must be re-checked on load and problems flagged (`getLineProblem`). |
| **Code location** | `src/components/PlanBar.jsx`. `src/context/PlanContext.jsx` → `plan`, `planLines`. `src/components/BookingSummary.jsx` |
| **Evidence** | 1. Add HIIT Burn and Pilates Core → the bar appears listing both. 2. Open another class → the bar is still there. 3. Refresh → the plan is restored. 4. Book → both are listed beside the form. _(add screenshot)_ |

## Decision 3: Age is checked on the timetable, before adding (eligibility up front)
| Field | Content |
|---|---|
| **Problem** | On barrys.com, "at least 18 years old" only appears as a checkbox on the step-1 personal-details form (`barrys_02c`). On 1rebel.com, "You must be over 18" only appears on the 12-field sign-up form, after the sign-in wall (`1rebel_02b`, `1rebel_05b`). |
| **Decision** | A **"Your age" box at the top of the timetable**. Once filled in, 16+ classes the user can't join show a "Not for your age" tag and their Add button is disabled. The class page shows the same warning. The age is saved and pre-filled on the booking form, which checks it again. No account is needed. |
| **Alternative** | Show a "16+" badge only, and check the age when the booking form is submitted. |
| **Reason** | Under-16s (and parents booking for them) find out straight away which classes are possible, instead of after building a plan and filling in a form. |
| **Tradeoff** | Asks for a personal detail early, which some users may skip. If they skip it, 16+ classes are only checked at the booking form. |
| **Code location** | `src/components/AgeCheck.jsx`. `src/components/ClassRow.jsx` (`ageOk`). `src/rules/bookingRules.js` → `checkAge`. `src/utils/validation.js` → `validateBooking` |
| **Evidence** | 1. Open /classes and enter age 15 → HIIT Burn and Boxing Basics show "Not for your age" with Add disabled. 2. Change to 16 → they can be added. _(add screenshot)_ |
