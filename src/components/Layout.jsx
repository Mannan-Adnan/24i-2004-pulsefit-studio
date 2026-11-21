import { Outlet, ScrollRestoration } from 'react-router-dom';
import Header from './Header.jsx';

export default function Layout() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main" className="container">
        <Outlet />
      </main>
      <footer className="footer">
        <div className="container">
          <p>
            <strong>PulseFit Studio</strong> · Group fitness classes · F-10 Markaz, Islamabad
          </p>
          <p className="muted">Student project: all bookings are simulated. No class is reserved and no payment is taken.</p>
        </div>
      </footer>
      {/* Puts the scroll position back when the user presses Back. */}
      <ScrollRestoration />
    </>
  );
}
