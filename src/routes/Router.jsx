import {
    BrowserRouter,
    Routes,
    Route,
    useLocation
} from 'react-router-dom';

import { AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

import PageTransition from '../components/PageTransition/PageTransition';
import FloatingNotes from '../components/FloatingNotes/FloatingNotes';
import ProtectedRoute from './ProtectedRoute';
import { appendNavigationActivity } from '../utils/navigationActivity';

import Login from '../pages/auth/Login/index';
import Register from '../pages/auth/Register/index';
import Home from '../pages/Home/index';
import Search from '../pages/Search/index';
import Compare from '../pages/Compare/index';
import Information from '../pages/Information/index';
import Detail from '../pages/Detail/index';
import Saved from '../pages/Saved/index';
import Profile from '../pages/Profile/index';
import Notes from '../pages/Notes/index';
import Alerts from '../pages/Alerts/index';
import EditProfile from "../pages/EditProfile/index";
import ResetPassword from "../pages/ResetPassword";
import Workspace from "../pages/Workspace";
import Insights from '../pages/Insights/index';

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
                        path="/insights"
                        element={
                            <ProtectedRoute>
                                <Insights />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
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
            <NavigationTracker />
            <GlobalFloatingNotes />
            <AnimatedRoutes />
        </BrowserRouter>
    );
}