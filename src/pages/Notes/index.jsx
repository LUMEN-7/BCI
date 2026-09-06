import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	IoArrowBackOutline,
	IoAddOutline,
	IoSearchOutline,
	IoDocumentTextOutline,
	IoTrashOutline,
} from 'react-icons/io5';

import './style.css';
import Navbar from '../../components/Navbar/Navbar';

const mockNotes = [
	{
		id: '1',
		title: 'Mustang GT 2024',
		description: 'Boa opção para comparação com modelos esportivos.',
		tag: 'Comparação',
		date: 'Hoje',
	},
	{
		id: '2',
		title: 'Bronco Sport',
		description: 'Pesquisar consumo, segurança e desempenho off-road.',
		tag: 'Pesquisa',
		date: 'Ontem',
	},
	{
		id: '3',
		title: 'Ideias para análise da IA',
		description: 'Gerar pontos fortes e fracos entre dois modelos.',
		tag: 'IA',
		date: '12 Jun',
	},
];

export default function Notes() {
	const navigate = useNavigate();

	const [search, setSearch] = useState('');
	const [notes, setNotes] = useState(mockNotes);

	const filteredNotes = useMemo(() => {
		const term = search.toLowerCase().trim();

		if (!term) return notes;

		return notes.filter(
			(note) =>
				note.title.toLowerCase().includes(term) ||
				note.description.toLowerCase().includes(term) ||
				note.tag.toLowerCase().includes(term)
		);
	}, [search, notes]);

	function handleDelete(id) {
		setNotes((prev) => prev.filter((note) => note.id !== id));
	}

	return (
		<main className="notes-page">
			<Navbar />
			<section className="notes-container">
				<header className="notes-header">
					<div>
						<p className="notes-eyebrow">Workspace</p>
						<h1>Anotações</h1>
						<p>
							Organize ideias, observações e análises dos veículos
							em um espaço simples e visual.
						</p>
					</div>

					<button
						type="button"
						className="new-note-button"
						onClick={() => navigate('/addnotes')}
					>
						<IoAddOutline />
						Nova nota
					</button>
				</header>

				<div className="notes-toolbar">
					<IoSearchOutline />

					<input
						type="text"
						placeholder="Buscar anotações..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
				</div>

				<div className="notes-grid">
					{filteredNotes.map((note) => (
						<article key={note.id} className="note-card">
							<div className="note-icon">
								<IoDocumentTextOutline />
							</div>

							<div className="note-content">
								<div className="note-top">
									<span>{note.tag}</span>
									<small>{note.date}</small>
								</div>

								<h3>{note.title}</h3>
								<p>{note.description}</p>
							</div>

							<button
								type="button"
								className="delete-note-button"
								onClick={() => handleDelete(note.id)}
							>
								<IoTrashOutline />
							</button>
						</article>
					))}
				</div>
			</section>
		</main>
	);
}