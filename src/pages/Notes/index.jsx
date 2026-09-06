import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	IoAddOutline,
	IoSearchOutline,
	IoDocumentTextOutline,
	IoTrashOutline,
	IoArrowForwardOutline,
} from 'react-icons/io5';

import './style.css';
import Navbar from '../../components/Navbar/Navbar';

const mockNotes = [
	{
		id: '1',
		title: 'Mustang GT 2024',
		description:
			'Boa opção para comparação com modelos esportivos.',
		tag: 'Comparação',
		date: 'Hoje',
	},
	{
		id: '2',
		title: 'Bronco Sport',
		description:
			'Pesquisar consumo, segurança e desempenho off-road.',
		tag: 'Pesquisa',
		date: 'Ontem',
	},
	{
		id: '3',
		title: 'Ideias para análise da IA',
		description:
			'Gerar pontos fortes e fracos entre dois modelos.',
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

		return notes.filter((note) =>
			[
				note.title,
				note.description,
				note.tag,
			].some((value) =>
				value.toLowerCase().includes(term)
			)
		);
	}, [search, notes]);

	function handleDelete(id) {
		setNotes((prev) =>
			prev.filter((note) => note.id !== id)
		);
	}

	return (
		<main className="notes-page">
			<Navbar />

			<section className="notes-container">
				{/* HEADER */}
				<header className="notes-header">
					<div className="notes-heading">
						<span className="notes-eyebrow">
							Workspace
						</span>

						<h1>Anotações</h1>

						<p>
							Organize ideias, observações e análises
							dos veículos em um espaço simples e visual.
						</p>
					</div>

					<button
						type="button"
						className="new-note-button"
						onClick={() => navigate('/addnotes')}
					>
						<IoAddOutline />
						<span>Nova nota</span>
					</button>
				</header>

				{/* TOOLBAR */}
				<div className="notes-toolbar">
					<div className="notes-search">
						<IoSearchOutline />

						<input
							type="text"
							placeholder="Buscar anotações..."
							value={search}
							onChange={(e) =>
								setSearch(e.target.value)
							}
						/>
					</div>
				</div>

				{/* GRID */}
				{filteredNotes.length > 0 ? (
					<section className="notes-grid">
						{filteredNotes.map((note) => (
							<article
								key={note.id}
								className="note-card"
							>
								<div className="note-card-top">
									<div className="note-icon">
										<IoDocumentTextOutline />
									</div>

									<button
										type="button"
										className="delete-note-button"
										onClick={() =>
											handleDelete(note.id)
										}
										aria-label={`Excluir nota ${note.title}`}
									>
										<IoTrashOutline />
									</button>
								</div>

								<div className="note-content">
									<div className="note-meta">
										<span className="note-tag">
											{note.tag}
										</span>

										<span className="note-date">
											{note.date}
										</span>
									</div>

									<h2>{note.title}</h2>

									<p>{note.description}</p>
								</div>

								<button
									type="button"
									className="note-open-button"
									onClick={() =>
										navigate(
											`/notes/${note.id}`
										)
									}
								>
									<span>Ver nota</span>
									<IoArrowForwardOutline />
								</button>
							</article>
						))}
					</section>
				) : (
					<section className="notes-empty">
						<div className="notes-empty-icon">
							<IoDocumentTextOutline />
						</div>

						<h2>Nenhuma anotação encontrada</h2>

						<p>
							{search
								? 'Tente buscar por outro termo.'
								: 'Comece criando sua primeira anotação.'}
						</p>

						{!search && (
							<button
								type="button"
								className="empty-create-button"
								onClick={() =>
									navigate('/addnotes')
								}
							>
								<IoAddOutline />
								Criar primeira nota
							</button>
						)}
					</section>
				)}
			</section>
		</main>
	);
}