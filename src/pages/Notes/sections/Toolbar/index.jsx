import { IoSearchOutline } from 'react-icons/io5';
import './style.css';

export default function NotesToolbar({ search, onSearch }) {
	return <div className="notes-toolbar"><div className="notes-search"><IoSearchOutline /><input type="text" placeholder="Buscar anotações..." value={search} onChange={(event) => onSearch(event.target.value)} /></div></div>;
}
