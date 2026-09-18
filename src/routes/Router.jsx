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
import PageLoader from '../components/PageLoader/PageLoader';
import ProtectedRoute from './ProtectedRoute';
import { appendNavigationActivity } from '../utils/navigationActivity';

const Login = lazy(() => import('../pages/auth/Login/index'));
const Register = lazy(() => import('../pages/auth/Register/index'));
const Home = lazy(() => import('../pages/Home/index'));
const Search = lazy(() => import('../pages/Search/index'));
const Compare = lazy(() => import('../pages/Compare/index'));
const Information = lazy(() => import('../pages/Information/index'));
const Detail = lazy(() => import('../pages/Detail/index'));
const Saved = lazy(() => import('../pages/Saved/index'));
const Profile = lazy(() => import('../pages/Profile/index'));
const Notes = lazy(() => import('../pages/Notes/index'));
const Alerts = lazy(() => import('../pages/Alerts/index'));
const EditProfile = lazy(() => import('../pages/EditProfile/index'));
const ResetPassword = lazy(() => import('../pages/ResetPassword'));
const Workspace = lazy(() => import('../pages/Workspace'));
const Insights = lazy(() => import('../pages/Insights/index'));

function NavigationTracker() {
    const location = useLocation();

    useEffect(() => {
        appendNavigationActivity(location.pathname, location.state);
    }, [location.pathname, location.state]);

    return null;
}


function AnimatedRoutes() {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <PageTransition key={location.pathname}>
                <Suspense fallback={<PageLoader />}>
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
                        element={<ResetPassword />}
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

                    <Route
                        path="/workspace"
                        element={
                            <ProtectedRoute>
                                <Workspace />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/loading"
                        element={<Loading />}
                    />

                    {/* ERRO GLOBAL ENVIADO PELO SISTEMA */}
                    <Route
                        path="/error"
                        element={<Error />}
                    />

                    {/* QUALQUER ROTA QUE NÃO EXISTE = 404 */}
                    <Route
                        path="*"
                        element={
                            <Error
                                statusCode={404}
                            />
                        }
                    />

                    {/* 
                    <Route
                        path="/Insights"
                        element={<Insights />}
                    />
                    */}
                    <Route
                        path="/insights"
                        element={
                            <ProtectedRoute>
                                <Insights />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
                </Suspense>
            </PageTransition>
        </AnimatePresence>
    );
}

function GlobalFloatingNotes() {
    const location = useLocation();
    const publicRoutes = ['/', '/register', '/reset-password'];
    const isPublic = publicRoutes.includes(location.pathname);

    if (isPublic) return null;

    return <FloatingNotes />;
}

export default function Router() {
    return (
        <BrowserRouter>
            <GlobalErrorBoundary>
                <AnimatedRoutes />
            </GlobalErrorBoundary>
            <NavigationTracker />
            <GlobalFloatingNotes />
            <AnimatedRoutes />
        </BrowserRouter>
    );
}
