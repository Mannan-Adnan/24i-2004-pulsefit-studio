import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import HomePage from './pages/HomePage.jsx';
import ClassesPage from './pages/ClassesPage.jsx';
import ClassPage from './pages/ClassPage.jsx';
import PlanPage from './pages/PlanPage.jsx';
import BookPage from './pages/BookPage.jsx';
import ConfirmationPage from './pages/ConfirmationPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

// All routes of the app. Layout shows the header/footer around every page.
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'classes', element: <ClassesPage /> },
      { path: 'classes/:id', element: <ClassPage /> }, // parameterized details route
      { path: 'plan', element: <PlanPage /> },
      { path: 'book', element: <BookPage /> },
      { path: 'confirmation', element: <ConfirmationPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
