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

/*
 * O Loading especial NÃO é lazy.
 *
 * Assim, ao sair do Login para /loading,
 * o Suspense não precisa mostrar o PageLoader
 * antes da animação do BCI.
 */
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

                        {/* LOGIN */}
                        <Route
                            path="/"
                            element={<Login />}
                        />


                        {/* CADASTRO */}
                        <Route
                            path="/register"
                            element={<Register />}
                        />


                        {/* WELCOME */}
                        <Route
                            path="/welcome"
                            element={
                                <ProtectedRoute>
                                    <Welcome />
                                </ProtectedRoute>
                            }
                        />


                        {/* LOADING ESPECIAL LOGIN → HOME */}
                        <Route
                            path="/loading"
                            element={
                                <ProtectedRoute>
                                    <Loading />
                                </ProtectedRoute>
                            }
                        />


                        {/* HOME */}
                        <Route
                            path="/home"
                            element={
                                <ProtectedRoute>
                                    <Home />
                                </ProtectedRoute>
                            }
                        />


                        {/* SEARCH */}
                        <Route
                            path="/search"
                            element={
                                <ProtectedRoute>
                                    <Search />
                                </ProtectedRoute>
                            }
                        />


                        {/* COMPARE */}
                        <Route
                            path="/compare"
                            element={
                                <ProtectedRoute>
                                    <Compare />
                                </ProtectedRoute>
                            }
                        />


                        {/* INFORMATION */}
                        <Route
                            path="/information/:id"
                            element={
                                <ProtectedRoute>
                                    <Information />
                                </ProtectedRoute>
                            }
                        />


                        {/* DETAIL */}
                        <Route
                            path="/compare/detail"
                            element={
                                <ProtectedRoute>
                                    <Detail />
                                </ProtectedRoute>
                            }
                        />


                        {/* SAVED */}
                        <Route
                            path="/saved"
                            element={
                                <ProtectedRoute>
                                    <Saved />
                                </ProtectedRoute>
                            }
                        />


                        {/* PROFILE */}
                        <Route
                            path="/profile"
                            element={
                                <ProtectedRoute>
                                    <Profile />
                                </ProtectedRoute>
                            }
                        />


                        {/* EDIT PROFILE */}
                        <Route
                            path="/edit-profile"
                            element={
                                <ProtectedRoute>
                                    <EditProfile />
                                </ProtectedRoute>
                            }
                        />


                        {/* RESET PASSWORD */}
                        <Route
                            path="/reset-password"
                            element={
                                <ResetPassword />
                            }
                        />


                        {/* NOTES */}
                        <Route
                            path="/notes"
                            element={
                                <ProtectedRoute>
                                    <Notes />
                                </ProtectedRoute>
                            }
                        />


                        {/* ALERTS */}
                        <Route
                            path="/alerts"
                            element={
                                <ProtectedRoute>
                                    <Alerts />
                                </ProtectedRoute>
                            }
                        />


                        {/* WORKSPACE */}
                        <Route
                            path="/workspace"
                            element={
                                <ProtectedRoute>
                                    <Workspace />
                                </ProtectedRoute>
                            }
                        />


                        {/* INSIGHTS */}
                        <Route
                            path="/insights"
                            element={
                                <ProtectedRoute>
                                    <Insights />
                                </ProtectedRoute>
                            }
                        />


                        {/* ERRO GLOBAL */}
                        <Route
                            path="/error"
                            element={<Error />}
                        />


                        {/* 404 */}
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
        '/loading'
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
        '/loading'
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