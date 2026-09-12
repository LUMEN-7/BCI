import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listarAnotacoes, excluirAnotacao } from '@/services/noteService';
import { getStoredNotes, deleteNote as deleteStoredNote } from '@/utils/notesStorage';

function adaptarAnotacao(anotacao) {
	const primeiroBlocoComTexto = anotacao.blocos?.find((b) => b.texto);
	return {
		id: String(anotacao.id),
		title: anotacao.titulo || anotacao.title || 'Sem título',
		description: primeiroBlocoComTexto?.texto ?? anotacao.description ?? anotacao.content ?? '',
		tag: anotacao.subtitulo || anotacao.tag || 'Sem tag',
		date: anotacao.atualizadoEm || anotacao.updatedAt
			? new Date(anotacao.atualizadoEm || anotacao.updatedAt).toLocaleDateString('pt-BR')
			: new Date().toLocaleDateString('pt-BR'),
		rawNote: anotacao,
	};
}

export default function useNotesController() {
	const navigate = useNavigate();
	const [search, setSearch] = useState('');
	const [notes, setNotes] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	const carregarAnotacoes = async () => {
		setLoading(true);
		setError('');
		try {
			const localNotes = getStoredNotes();
			let apiNotes = [];
			try {
				const resultado = await listarAnotacoes();
				if (Array.isArray(resultado)) {
					apiNotes = resultado;
				}
			} catch {
				// Usa as notas locais se offline ou erro na API
			}

			// Mesclar sem duplicar por ID
			const mergedMap = new Map();
			localNotes.forEach((note) => {
				mergedMap.set(String(note.id), {
					id: String(note.id),
					title: note.title || 'Sem título',
					description: note.content || '',
					tag: 'Anotação BCI',
					date: new Date(note.updatedAt || note.createdAt).toLocaleDateString('pt-BR'),
					rawNote: note,
				});
			});

			apiNotes.forEach((note) => {
				if (!mergedMap.has(String(note.id))) {
					mergedMap.set(String(note.id), adaptarAnotacao(note));
				}
			});

			setNotes(Array.from(mergedMap.values()));
		} catch (err) {
			setError(err.message || 'Não foi possível carregar as anotações.');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		carregarAnotacoes();

		window.addEventListener('floating-notes-updated', carregarAnotacoes);
		window.addEventListener('storage', carregarAnotacoes);

		return () => {
			window.removeEventListener('floating-notes-updated', carregarAnotacoes);
			window.removeEventListener('storage', carregarAnotacoes);
		};
	}, []);

	const filteredNotes = useMemo(() => {
		const term = search.toLowerCase().trim();
		if (!term) return notes;
		return notes.filter((note) => [note.title, note.description, note.tag].some((value) => value.toLowerCase().includes(term)));
	}, [search, notes]);

	async function handleDelete(id) {
		const anterior = notes;
		setNotes((current) => current.filter((note) => String(note.id) !== String(id)));
		deleteStoredNote(id);
		try {
			await excluirAnotacao(id);
		} catch {
			// Prossegue com exclusão local sem quebrar a UI
		}
	}

	return {
		search, setSearch, filteredNotes, loading, error,
		handleDelete,
		handleCreate: () => navigate('/addnotes'),
		handleOpen: (id) => navigate(`/notes/${id}`),
	};
}