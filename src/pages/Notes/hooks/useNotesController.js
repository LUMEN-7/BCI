import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listarAnotacoes, excluirAnotacao } from '@/services/noteService';

function adaptarAnotacao(anotacao) {
	const primeiroBlocoComTexto = anotacao.blocos.find((b) => b.texto);
	return {
		id: anotacao.id,
		title: anotacao.titulo,
		description: primeiroBlocoComTexto?.texto ?? '',
		tag: anotacao.subtitulo || 'Sem tag',
		date: new Date(anotacao.atualizadoEm).toLocaleDateString('pt-BR'),
	};
}

export default function useNotesController() {
	const navigate = useNavigate();
	const [search, setSearch] = useState('');
	const [notes, setNotes] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		async function carregar() {
			setLoading(true);
			setError('');
			try {
				const resultado = await listarAnotacoes();
				setNotes(resultado.map(adaptarAnotacao));
			} catch (err) {
				setError(err.message || 'Não foi possível carregar as anotações.');
			} finally {
				setLoading(false);
			}
		}
		carregar();
	}, []);

	const filteredNotes = useMemo(() => {
		const term = search.toLowerCase().trim();
		if (!term) return notes;
		return notes.filter((note) => [note.title, note.description, note.tag].some((value) => value.toLowerCase().includes(term)));
	}, [search, notes]);

	async function handleDelete(id) {
		const anterior = notes;
		setNotes((current) => current.filter((note) => note.id !== id)); // some da tela na hora
		try {
			await excluirAnotacao(id);
		} catch (err) {
			setNotes(anterior); // desfaz se a API recusar
			setError(err.message || 'Não foi possível excluir a anotação.');
		}
	}

	return {
		search, setSearch, filteredNotes, loading, error,
		handleDelete,
		handleCreate: () => navigate('/addnotes'),
		handleOpen: (id) => navigate(`/notes/${id}`),
	};
}