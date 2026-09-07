import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockNotes } from '../data';

export default function useNotesController() {
	const navigate = useNavigate();
	const [search, setSearch] = useState('');
	const [notes, setNotes] = useState(mockNotes);
	const filteredNotes = useMemo(() => {
		const term = search.toLowerCase().trim();
		if (!term) return notes;
		return notes.filter((note) => [note.title, note.description, note.tag].some((value) => value.toLowerCase().includes(term)));
	}, [search, notes]);

	return {
		search, setSearch, filteredNotes,
		handleDelete: (id) => setNotes((current) => current.filter((note) => note.id !== id)),
		handleCreate: () => navigate('/addnotes'),
		handleOpen: (id) => navigate(`/notes/${id}`),
	};
}
