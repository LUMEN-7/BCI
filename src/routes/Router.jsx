import {
    BrowserRouter,
    Routes,
    Route,
    useLocation
} from 'react-router-dom';

import { AnimatePresence } from 'framer-motion';
import { lazy, Suspense, useEffect } from 'react';

import PageTransition from '../components/PageTransition/PageTransition';
import GlobalErrorBoundary from '../components/GlobalErrorBoundary';
import FloatingNotes from '../components/FloatingNotes/FloatingNotes';
import AlertToast from '../components/AlertToast';
import PageLoader from '../components/PageLoader/PageLoader';

import ProtectedRoute from './ProtectedRoute';

import {
    appendNavigationActivity
} from '../utils/navigationActivity';

import Loading from '../pages/Loading/index';


/* =========================================================
   PÁGINAS LAZY
========================================================= */

const Login = lazy(() =>
    import('../pages/auth/Login/index')
);

const Register = lazy(() =>
    import('../pages/auth/Register/index')
);

const Home = lazy(() =>
    import('../pages/Home/index')
);

const Search = lazy(() =>
    import('../pages/Search/index')
);

const Compare = lazy(() =>
    import('../pages/Compare/index')
);

const Information = lazy(() =>
    import('../pages/Information/index')
);

const Detail = lazy(() =>
    import('../pages/Detail/index')
);

const Saved = lazy(() =>
    import('../pages/Saved/index')
);

const Profile = lazy(() =>
    import('../pages/Profile/index')
);

const Notes = lazy(() =>
    import('../pages/Notes/index')
);

const Alerts = lazy(() =>
    import('../pages/Alerts/index')
);

const EditProfile = lazy(() =>
    import('../pages/EditProfile/index')
);

const ResetPassword = lazy(() =>
    import('../pages/ResetPassword')
);

const WorkspaceAccess = lazy(() =>
    import('../pages/WorkspaceAccess')
);

const Workspace = lazy(() =>
    import('../pages/Workspace')
);

const Insights = lazy(() =>
    import('../pages/Insights/index')
);

const Error = lazy(() =>
    import('../pages/Error/index')
);

const Welcome = lazy(() =>
    import('../pages/Welcome/index')
);


/* =========================================================
   NAVIGATION TRACKER
========================================================= */

function NavigationTracker() {
    const location = useLocation();

    useEffect(() => {
        appendNavigationActivity(
            location.pathname,
            location.state
        );
    }, [
        location.pathname,
        location.state
    ]);

    return null;
}


/* =========================================================
   ROTAS
========================================================= */

function AnimatedRoutes() {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <PageTransition
                key={location.pathname}
            >
                <Suspense
                    fallback={<PageLoader />}
                >
                    <Routes location={location}>

                        <Route
                            path="/"
                            element={<Login />}
                        />


                        <Route
                            path="/register"
                            element={<Register />}
                        />


                        <Route
                            path="/welcome"
                            element={
                                <ProtectedRoute>
                                    <Welcome />
                                </ProtectedRoute>
                            }
                        />


                        <Route
                            path="/loading"
                            element={
                                <ProtectedRoute>
                                    <Loading />
                                </ProtectedRoute>
                            }
                        />


                        <Route
                            path="/home"
                            element={
                                <ProtectedRoute>
                                    <Home />
                                </ProtectedRoute>
                            }
                        />


                        <Route
                            path="/search"
                            element={
                                <ProtectedRoute>
                                    <Search />
                                </ProtectedRoute>
                            }
                        />


                        <Route
                            path="/compare"
                            element={
                                <ProtectedRoute>
                                    <Compare />
                                </ProtectedRoute>
                            }
                        />


                        <Route
                            path="/information/:id"
                            element={
                                <ProtectedRoute>
                                    <Information />
                                </ProtectedRoute>
                            }
                        />


                        <Route
                            path="/compare/detail"
                            element={
                                <ProtectedRoute>
                                    <Detail />
                                </ProtectedRoute>
                            }
                        />


                        <Route
                            path="/saved"
                            element={
                                <ProtectedRoute>
                                    <Saved />
                                </ProtectedRoute>
                            }
                        />


                        <Route
                            path="/profile"
                            element={
                                <ProtectedRoute>
                                    <Profile />
                                </ProtectedRoute>
                            }
                        />


                        <Route
                            path="/edit-profile"
                            element={
                                <ProtectedRoute>
                                    <EditProfile />
                                </ProtectedRoute>
                            }
                        />


                        <Route
                            path="/reset-password"
                            element={
                                <ResetPassword />
                            }
                        />


                        <Route
                            path="/notes"
                            element={
                                <ProtectedRoute>
                                    <Notes />
                                </ProtectedRoute>
                            }
                        />


                        <Route
                            path="/alerts"
                            element={
                                <ProtectedRoute>
                                    <Alerts />
                                </ProtectedRoute>
                            }
                        />


                        {/* =================================================
                            WORKSPACE — ENTRADA
                        ================================================= */}

                        <Route
                            path="/workspace"
                            element={
                                <ProtectedRoute>
                                    <WorkspaceAccess />
                                </ProtectedRoute>
                            }
                        />


                        {/* =================================================
                            WORKSPACE — AMBIENTE
                        ================================================= */}

                        <Route
                            path="/workspace/:workspaceId"
                            element={
                                <ProtectedRoute>
                                    <Workspace />
                                </ProtectedRoute>
                            }
                        />


                        <Route
                            path="/insights"
                            element={
                                <ProtectedRoute>
                                    <Insights />
                                </ProtectedRoute>
                            }
                        />


                        <Route
                            path="/error"
                            element={<Error />}
                        />


                        <Route
                            path="*"
                            element={
                                <Error
                                    statusCode={404}
                                />
                            }
                        />

                    </Routes>
                </Suspense>
            </PageTransition>
        </AnimatePresence>
    );
}


/* =========================================================
   FLOATING NOTES
========================================================= */

function GlobalFloatingNotes() {
    const location = useLocation();

    const hiddenRoutes = [
        '/',
        '/register',
        '/reset-password',
        '/welcome',
        '/loading',
        '/workspace'
    ];

    const shouldHide =
        hiddenRoutes.includes(
            location.pathname
        );

    if (shouldHide) {
        return null;
    }

    return <FloatingNotes />;
}


/* =========================================================
   ALERT TOAST
========================================================= */

function GlobalAlertToast() {
    const location = useLocation();

    const hiddenRoutes = [
        '/',
        '/register',
        '/reset-password',
        '/welcome',
        '/loading',
        '/workspace'
    ];

    const shouldHide =
        hiddenRoutes.includes(
            location.pathname
        );

    if (shouldHide) {
        return null;
    }

    return <AlertToast />;
}


/* =========================================================
   ROUTER
========================================================= */

export default function Router() {
    return (
        <BrowserRouter>

            <GlobalErrorBoundary>
                <AnimatedRoutes />
            </GlobalErrorBoundary>

            <NavigationTracker />

            <GlobalFloatingNotes />

            <GlobalAlertToast />

        </BrowserRouter>
    );
}