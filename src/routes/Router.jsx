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
// import Insights from '../pages/Insights/index';

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
                        element={<Home />}
                    />

                    <Route
                        path="/search"
                        element={<Search />}
                    />

                    <Route
                        path="/compare"
                        element={<Compare />}
                    />

                    <Route
                        path="/information/:id"
                        element={<Information />}
                    />

                    <Route
                        path="/compare/detail"
                        element={<Detail />}
                    />

                    <Route
                        path="/saved"
                        element={<Saved />}
                    />

                    <Route
                        path="/profile"
                        element={<Profile />}
                    />

                    <Route
                        path="/edit-profile"
                        element={<EditProfile />}
                    />

                    <Route
                        path="/reset-password"
                        element={<ResetPassword />}
                    />

                    <Route
                        path="/notes"
                        element={<Notes />}
                    />

                    <Route
                        path="/alerts"
                        element={<Alerts />}
                    />

                    <Route
                        path="/workspace"
                        element={<Workspace />}
                    />

                    {/* 
                    <Route
                        path="/Insights"
                        element={<Insights />}
                    />*/}
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