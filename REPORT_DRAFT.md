# CS4032 Assignment 02 Report: PulseFit Studio
> Draft. Fill in the _italic_ parts, add screenshots where it says 📷, then export to PDF.
> This file is a working draft. Don't submit it as-is.

## 1. Student and project details
| | |
|---|---|
| Name | Mannan bin Adnan |
| Roll number | 24I-2004 |
| Section | _X_ |
| Business name | PulseFit Studio |
| Repository | _https://github.com/..._ |
| Deployment | _https://....vercel.app_ |
| Final commit hash | _run `git rev-parse HEAD`_ |

## 2. Business profile
| Element | Detail |
|---|---|
| Business identity | **PulseFit Studio**: group classes in yoga, HIIT, boxing, Zumba, spin and pilates |
| Primary audience | Working adults and university students in Islamabad / Rawalpindi |
| Operating area | One physical studio in F-10 Markaz, Islamabad |
| Main customer task | Find suitable classes, choose spots, enter details and book |
| Business goal | A completed (simulated) class booking |
| Offering | 12 weekly sessions (`src/data/classes.js`) |

## 3. Operating rules
| | Rule 1: Capacity | Rule 2: Eligibility | Rule 3: Pricing |
|---|---|---|---|
| **Condition** | 1–4 spots per class, never more than `seatsLeft`. 0 seats = full. | Classes with `minAge: 16` need the entered age to be ≥ 16. | 3+ spots in total get **15% off**. Max **8** spots per booking. |
| **Where the user is told** | Seats column on every timetable row and the class page. "Book 1–4 spots" on the class page. Home page "How booking works" | 16+ tag on rows. "Your age" box on the timetable. "Not for your age" tag. Warning on the class page | Home page "How booking works". Summary says "Add N more spots for 15% off" |
| **What the app does** | Full classes can't be added. + button stops at min(4, seats). Plan lines over capacity are flagged and booking is blocked | Add disabled for 16+ classes when age < 16. Plan lines flagged if the age changes later. Booking form checks the age again and won't submit | Discount calculated live. Over 8 spots disables "Continue to booking" with a message |
| **Boundary case** | Advanced Boxing has 2 seats → 2 allowed, + disabled. Other classes stop at 4 | Age 16 → allowed. Age 15 → blocked | 2 spots → no discount. Exactly 3 → 15% off. Exactly 8 → allowed. 9 → blocked |

## 4. Reference-site investigation
Sites: **barrys.com** (Pasadena studio) and **1rebel.com** (London). Tested on desktop Chrome, with mobile checked in a 390px frame.

### Problem 1: Timetable missing price, level, duration or spots left
- **URLs:** barrys.com/schedule/pasadena, 1rebel.com/en-gb/reserve
- **Task:** Choose a suitable class from the timetable.
- **Observed:** Barry's timetable shows time, duration, class and instructor, but no price or level. Prices are on a separate Pricing tab ($34 single class). 1Rebel rows show no duration, price or spots left. Only full classes show "Waitlist".
- **Possible consequence (opinion):** users can't compare classes without extra clicks, and can't tell a nearly-full class from an empty one.
- **Our fix:** Decision 1.
- 📷 `barrys_01`, `barrys_05`, `1rebel_01`

### Problem 2: Selected class lost between timetable and booking
- **URL:** barrys.com/schedule/pasadena → /booking?location=9658&step=1
- **Task:** Book a specific class.
- **Observed:**
  1. Clicked MON, then the 8:45 class.
  2. Every class links to the same `/book-now?location=9658`.
  3. The next two pages ("Book your First Class or Log In", then "Step 1/4") don't show the chosen class.
- **Possible consequence (opinion):** users may doubt their selection, or have to pick it again later.
- **Our fix:** Decision 2.
- 📷 `barrys_02a`, `barrys_02b`, `barrys_02c`

### Problem 3: Age eligibility only revealed on a later form
- **URLs:** barrys.com/booking?location=9658&step=1, 1rebel.com/en-gb/auth/signup
- **Task:** Find out whether you are old enough for a class before choosing it.
- **Observed:** Barry's shows "at least 18 years old" only as a checkbox on the step-1 personal-details form. 1Rebel shows "You must be over 18" only on the 12-field sign-up form, after "Book Now" sends you to Sign In.
- **Possible consequence (opinion):** younger users only find out they can't attend after choosing a class and starting a form.
- **Our fix:** Decision 3.
- 📷 `barrys_02c`, `1rebel_02b`, `1rebel_05b`

## 5. Frontend decisions
_Copy the three tables from DECISIONS.md here._

## 6. Implemented application
📷 Add annotated screenshots (1–2 lines each):
1. Home: "View this week's timetable" is the primary action. "How booking works" explains the rules.
2. Timetable (1280px): "Your age" box, day headings, rows with time, duration, level, 16+, price and seats.
3. Timetable (390px): rows stack into two columns. The sticky plan bar is at the bottom.
4. Class details: rules listed before booking, spots control.
5. My plan: problem line in red with ⚠ text, discount summary.
6. Book: age error, valid values kept.
7. Confirmation: booking number, table, labelled simulated.

## 7. Verification
### Edge-case checklist
| Case | Steps | Expected | Observed |
|---|---|---|---|
| Missing image/info | Open Power Yoga, Family Zumba | "No picture" tile / "No description available" | _✔ / ✘_ |
| Long content | Find "Weekend Long Ride…" | Title wraps, no sideways scroll | _ |
| Empty dataset | Home → "Simulate empty timetable" → Classes | "No classes are scheduled this week" | _ |
| No matches | Search "xyz" | Message and "Show all classes" button | _ |
| Invalid URL | /classes/abc and /xyz | "Class not found" / "Page not found" with links | _ |
| Invalid form | Book with phone "123", no checkbox | Specific errors, values kept | _ |
| Changed availability | Yoga in plan → "Simulate Morning Yoga becoming full" | Plan line flagged, booking blocked, Remove works | _ |
| Restored selection | Add classes, refresh | Plan restored and re-checked | _ |
| Loading failure | "Simulate loading failure" → Classes → untick → Retry | Error then timetable loads | _ |

### Improvements (actions / expected / observed)
| Improvement | Actions | Expected | Observed |
|---|---|---|---|
| Full info in timetable rows | Open /classes | Every row shows price, level, seats and duration, grouped by day | _ |
| Plan always visible | Add 2 classes → open another class → refresh → Book | Sticky bar lists both. Restored after refresh. Listed beside the form | _ |
| Age checked up front | Enter age 15 on /classes | 16+ classes show "Not for your age", Add disabled | _ |

### Automated test
Command: `npm test`. Result: **4 tests, 4 passed, 0 failed** (valid 2 spots, boundary exactly 3 = discount, boundary exactly 8 = allowed, invalid 9 = blocked). 📷 terminal screenshot

## 8. Limitations
- No backend, real payments or accounts. All bookings are simulated.
- Seats don't go down after a booking. The timetable is a fixed sample week without real dates.
- The confirmation is lost if the page is refreshed (not stored, to avoid saving personal details).
- Class pictures are emoji tiles, not photos.
