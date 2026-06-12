import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	IoArrowBackOutline,
	IoSaveOutline,
	IoPricetagOutline,
} from 'react-icons/io5';

import './style.css';

export default function NewNote() {
	const navigate = useNavigate();

	const [title, setTitle] = useState('');
	const [tag, setTag] = useState('');
	const [content, setContent] = useState('');

	function handleSave(event) {
		event.preventDefault();

		const newNote = {
			id: Date.now().toString(),
			title: title.trim(),
			tag: tag.trim() || 'Sem tag',
			description: content.trim(),
			date: 'Hoje',
		};

		const storedNotes =
			JSON.parse(localStorage.getItem('notes')) || [];

		localStorage.setItem(
			'notes',
			JSON.stringify([newNote, ...storedNotes])
		);

		navigate('/notes');
	}

	return (
		<main className="new-note-page">
			<section className="new-note-container">
				<button
					type="button"
					className="new-note-back"
					onClick={() => navigate('/notes')}
				>
					<IoArrowBackOutline />
					<span>Voltar</span>
				</button>

				<form className="new-note-card" onSubmit={handleSave}>
					<div className="new-note-icon">
						<IoPricetagOutline />
					</div>

					<input
						className="note-title-input"
						type="text"
						placeholder="Título da anotação"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						required
					/>

					<div className="note-meta-row">
						<span>Tag</span>

						<input
							type="text"
							placeholder="Ex: Comparação, IA, Pesquisa..."
							value={tag}
							onChange={(e) => setTag(e.target.value)}
						/>
					</div>

					<textarea
						className="note-content-input"
						placeholder="Escreva sua anotação aqui..."
						value={content}
						onChange={(e) => setContent(e.target.value)}
						required
					/>

					<div className="new-note-actions">
						<button
							type="button"
							className="cancel-note-button"
							onClick={() => navigate('/notes')}
						>
							Cancelar
						</button>

						<button
							type="submit"
							className="save-note-button"
						>
							<IoSaveOutline />
							Salvar nota
						</button>
					</div>
				</form>
			</section>
		</main>
	);
}