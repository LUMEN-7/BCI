import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from '../pages/auth/Login/index';
import Register from '../pages/auth/Register/index'
import Home from '../pages/Home/index'
import Search from '../pages/Search/index'
import Compare from '../pages/Compare/index'
import Information from '../pages/Information/index'
import Detail from '../pages/Detail/index'
import Saved from '../pages/Saved/index'
import Profile from '../pages/Profile/index'
import Notes from '../pages/Notes/index'
import NewNotes from '../pages/NewNotes/index'

export default function Router() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route path="/home" element={<Home />} />
				<Route path="/search" element={<Search />} />
				<Route path="/compare" element={<Compare />} />
				<Route path="/information/:id" element={<Information />} />
				<Route path="/compare/detail" element={<Detail />} />
				<Route path="/saved" element={<Saved />} />
				<Route path="/profile" element={<Profile />} />
				<Route path="/notes" element={<Notes/>} />
				<Route path="/addnotes" element={<NewNotes/>} />
			</Routes>
		</BrowserRouter>
	);
}