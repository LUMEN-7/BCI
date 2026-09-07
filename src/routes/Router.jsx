import {
    BrowserRouter,
    Routes,
    Route,
    useLocation
} from 'react-router-dom';

import { AnimatePresence } from 'framer-motion';

import PageTransition from '../components/PageTransition/PageTransition';

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
import NewNotes from '../pages/NewNotes/index';
import Alerts from '../pages/Alerts/index';
// import Insights from '../pages/Insights/index';
// import Workspace from '../pages/Workspace/index';

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
                        path="/notes"
                        element={<Notes />}
                    />

                    <Route
                        path="/addnotes"
                        element={<NewNotes />}
                    />

                    <Route
                        path="/alerts"
                        element={<Alerts />}
                    />
{/* 
                    <Route
                        path="/Insights"
                        element={<Insights />}
                    />

                    <Route
                        path="/workspace"
                        element={<Workspace />}
                    /> */}
                </Routes>
            </PageTransition>
        </AnimatePresence>
    );
}


export default function Router() {
    return (
        <BrowserRouter>
            <AnimatedRoutes />
        </BrowserRouter>
    );
}