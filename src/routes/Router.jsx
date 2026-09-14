import {
    BrowserRouter,
    Routes,
    Route,
    useLocation
} from 'react-router-dom';

import { AnimatePresence } from 'framer-motion';

import PageTransition from '../components/PageTransition/PageTransition';
import GlobalErrorBoundary from '../components/GlobalErrorBoundary';

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
import EditProfile from "../pages/EditProfile/index";
import ResetPassword from "../pages/ResetPassword";
import Workspace from "../pages/Workspace";
import Loading from "../pages/Loading";
import Error from "../pages/Error";
// import Insights from '../pages/Insights/index';


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
                        path="/addnotes"
                        element={<NewNotes />}
                    />

                    <Route
                        path="/alerts"
                        element={<Alerts />}
                    />

                    <Route
                        path="/workspace"
                        element={<Workspace />}
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
                </Routes>
            </PageTransition>
        </AnimatePresence>
    );
}


export default function Router() {
    return (
        <BrowserRouter>
            <GlobalErrorBoundary>
                <AnimatedRoutes />
            </GlobalErrorBoundary>
        </BrowserRouter>
    );
}