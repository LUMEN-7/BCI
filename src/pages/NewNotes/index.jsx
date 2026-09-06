import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	IoArrowBackOutline,
	IoSaveOutline,
	IoAddOutline,
	IoTrashOutline,
	IoTextOutline,
	IoImageOutline,
	IoCarSportOutline,
	IoRemoveOutline,
	IoPricetagOutline,
	IoCloseOutline,
	IoCheckmarkOutline,
	IoChevronDownOutline,
	IoDocumentTextOutline,
} from 'react-icons/io5';

import './style.css';

const savedCars = [
	{
		id: '1',
		name: 'Mustang GT 2024',
		brand: 'Ford',
		image:
			'https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/mustang.png',
		engine: '5.0 V8',
		power: '488 cv',
		type: 'Coupé',
		description:
			'Modelo esportivo com foco em potência, performance e experiência de direção.',
	},
	{
		id: '2',
		name: 'Bronco 2021',
		brand: 'Ford',
		image:
			'https://raw.githubusercontent.com/LUMEN-7/images/refs/heads/main/carros/2021_ford_bronco.png',
		engine: '2.7 V6',
		power: '330 cv',
		type: 'SUV',
		description:
			'SUV robusto voltado para aventura, trilhas e uso off-road.',
	},
];

function createBlock(type) {
	const base = {
		id: `${Date.now()}-${Math.random()}`,
		type,
	};

	switch (type) {
		case 'heading':
			return {
				...base,
				content: '',
			};

		case 'text':
			return {
				...base,
				content: '',
			};

		case 'image':
			return {
				...base,
				src: '',
				alt: '',
			};

		case 'vehicle':
			return {
				...base,
				vehicleId: null,
			};

		case 'divider':
			return base;

		default:
			return {
				...base,
				content: '',
			};
	}
}

export default function NewNote() {
	const navigate = useNavigate();
	const fileInputRef = useRef(null);

	const [title, setTitle] = useState('');
	const [tag, setTag] = useState('');
	const [blocks, setBlocks] = useState([
		createBlock('text'),
	]);

	const [showBlockMenu, setShowBlockMenu] = useState(false);
	const [vehiclePicker, setVehiclePicker] = useState(null);
	const [activeImageBlock, setActiveImageBlock] = useState(null);

	function updateBlock(id, changes) {
		setBlocks((current) =>
			current.map((block) =>
				block.id === id
					? {
							...block,
							...changes,
						}
					: block
			)
		);
	}

	function removeBlock(id) {
		setBlocks((current) =>
			current.filter((block) => block.id !== id)
		);
	}

	function addBlock(type, index = blocks.length) {
		const newBlock = createBlock(type);

		setBlocks((current) => {
			const next = [...current];

			next.splice(index, 0, newBlock);

			return next;
		});

		setShowBlockMenu(false);
	}

	function addBlockAfter(index, type) {
		addBlock(type, index + 1);
	}

	function handleImageSelect(event) {
		const file = event.target.files?.[0];

		if (!file || activeImageBlock === null) return;

		if (!file.type.startsWith('image/')) return;

		const reader = new FileReader();

		reader.onload = () => {
			updateBlock(activeImageBlock, {
				src: reader.result,
				alt: file.name,
			});

			setActiveImageBlock(null);
		};

		reader.readAsDataURL(file);

		event.target.value = '';
	}

	function openImagePicker(blockId) {
		setActiveImageBlock(blockId);

		setTimeout(() => {
			fileInputRef.current?.click();
		}, 0);
	}

	function selectVehicle(blockId, vehicleId) {
		updateBlock(blockId, {
			vehicleId,
		});

		setVehiclePicker(null);
	}

	function handleSave(event) {
		event.preventDefault();

		const cleanTitle = title.trim();

		if (!cleanTitle) return;

		const newNote = {
			id: Date.now().toString(),
			title: cleanTitle,
			tag: tag.trim() || 'Sem tag',
			blocks,
			date: 'Hoje',
			updatedAt: new Date().toISOString(),
		};

		const storedNotes =
			JSON.parse(localStorage.getItem('notes')) || [];

		localStorage.setItem(
			'notes',
			JSON.stringify([newNote, ...storedNotes])
		);

		navigate('/notes');
	}

	function getVehicle(vehicleId) {
		return savedCars.find((car) => car.id === vehicleId);
	}

	function renderBlock(block, index) {
		const vehicle = getVehicle(block.vehicleId);

		return (
			<div className="editor-block-wrapper" key={block.id}>
				<div className="block-hover-actions">
					<button
						type="button"
						onClick={() => addBlockAfter(index, 'text')}
						title="Adicionar bloco"
					>
						<IoAddOutline />
					</button>
				</div>

				{block.type === 'heading' && (
					<div className="editor-block heading-block">
						<div className="block-type-icon">
							<IoDocumentTextOutline />
						</div>

						<input
							type="text"
							value={block.content}
							onChange={(event) =>
								updateBlock(block.id, {
									content: event.target.value,
								})
							}
							placeholder="Título da seção"
							className="heading-input"
						/>

						<button
							type="button"
							className="remove-block-button"
							onClick={() => removeBlock(block.id)}
						>
							<IoTrashOutline />
						</button>
					</div>
				)}

				{block.type === 'text' && (
					<div className="editor-block text-block">
						<textarea
							value={block.content}
							onChange={(event) =>
								updateBlock(block.id, {
									content: event.target.value,
								})
							}
							placeholder="Escreva alguma coisa..."
							rows={1}
							onInput={(event) => {
								event.target.style.height = 'auto';
								event.target.style.height =
									`${event.target.scrollHeight}px`;
							}}
						/>

						<button
							type="button"
							className="remove-block-button"
							onClick={() => removeBlock(block.id)}
						>
							<IoTrashOutline />
						</button>
					</div>
				)}

				{block.type === 'image' && (
					<div className="editor-block image-block">
						{block.src ? (
							<div className="uploaded-image-wrapper">
								<img
									src={block.src}
									alt={block.alt || 'Imagem da nota'}
								/>

								<div className="image-overlay">
									<button
										type="button"
										onClick={() =>
											openImagePicker(block.id)
										}
									>
										<IoImageOutline />
										Trocar imagem
									</button>
								</div>
							</div>
						) : (
							<button
								type="button"
								className="image-upload-area"
								onClick={() =>
									openImagePicker(block.id)
								}
							>
								<span className="image-upload-icon">
									<IoImageOutline />
								</span>

								<strong>Adicionar imagem</strong>

								<small>
									Clique para selecionar uma imagem
								</small>
							</button>
						)}

						<button
							type="button"
							className="remove-block-button"
							onClick={() => removeBlock(block.id)}
						>
							<IoTrashOutline />
						</button>
					</div>
				)}

				{block.type === 'vehicle' && (
					<div className="editor-block vehicle-block">
						{vehicle ? (
							<div className="vehicle-note-card">
								<div className="vehicle-note-image">
									<img
										src={vehicle.image}
										alt={vehicle.name}
									/>
								</div>

								<div className="vehicle-note-info">
									<span>{vehicle.brand}</span>

									<h3>{vehicle.name}</h3>

									<div className="vehicle-note-specs">
										<span>{vehicle.engine}</span>
										<span>{vehicle.power}</span>
										<span>{vehicle.type}</span>
									</div>
								</div>

								<button
									type="button"
									className="change-vehicle-button"
									onClick={() =>
										setVehiclePicker(block.id)
									}
								>
									Trocar
								</button>
							</div>
						) : (
							<button
								type="button"
								className="vehicle-placeholder"
								onClick={() =>
									setVehiclePicker(block.id)
								}
							>
								<span>
									<IoCarSportOutline />
								</span>

								<div>
									<strong>
										Adicionar veículo
									</strong>

									<small>
										Insira um veículo salvo na
										sua anotação
									</small>
								</div>

								<IoChevronDownOutline />
							</button>
						)}

						<button
							type="button"
							className="remove-block-button"
							onClick={() => removeBlock(block.id)}
						>
							<IoTrashOutline />
						</button>
					</div>
				)}

				{block.type === 'divider' && (
					<div className="editor-block divider-block">
						<div />

						<button
							type="button"
							className="remove-block-button"
							onClick={() => removeBlock(block.id)}
						>
							<IoTrashOutline />
						</button>
					</div>
				)}
			</div>
		);
	}

	return (
		<main className="new-note-page">
			<section className="new-note-container">
				<header className="new-note-topbar">
					<button
						type="button"
						className="new-note-back"
						onClick={() => navigate('/notes')}
					>
						<IoArrowBackOutline />
						<span>Voltar</span>
					</button>

					<div className="new-note-actions">
						<span className="block-counter">
							{blocks.length}{' '}
							{blocks.length === 1
								? 'bloco'
								: 'blocos'}
						</span>

						<button
							type="button"
							className="save-note-button"
							onClick={handleSave}
						>
							<IoSaveOutline />
							Salvar nota
						</button>
					</div>
				</header>

				<form
					className="new-note-editor"
					onSubmit={handleSave}
				>
					<div className="note-heading">
						<div className="note-heading-icon">
							<IoDocumentTextOutline />
						</div>

						<input
							type="text"
							className="note-title-input"
							placeholder="Título da anotação"
							value={title}
							onChange={(event) =>
								setTitle(event.target.value)
							}
							required
						/>

						<div className="note-meta">
							<IoPricetagOutline />

							<input
								type="text"
								placeholder="Adicionar tag..."
								value={tag}
								onChange={(event) =>
									setTag(event.target.value)
								}
							/>
						</div>
					</div>

					<div className="editor-divider" />

					<div className="blocks-container">
						{blocks.map((block, index) =>
							renderBlock(block, index)
						)}
					</div>

					<div className="add-block-container">
						<button
							type="button"
							className="add-block-button"
							onClick={() =>
								setShowBlockMenu(
									(current) => !current
								)
							}
						>
							<IoAddOutline />
							Adicionar bloco
						</button>

						{showBlockMenu && (
							<div className="block-menu">
								<button
									type="button"
									onClick={() =>
										addBlock('text')
									}
								>
									<span>
										<IoTextOutline />
									</span>

									<div>
										<strong>Texto</strong>
										<small>
											Escreva uma
											anotação
										</small>
									</div>
								</button>

								<button
									type="button"
									onClick={() =>
										addBlock('heading')
									}
								>
									<span>
										<IoDocumentTextOutline />
									</span>

									<div>
										<strong>Seção</strong>
										<small>
											Crie um título
										</small>
									</div>
								</button>

								<button
									type="button"
									onClick={() =>
										addBlock('image')
									}
								>
									<span>
										<IoImageOutline />
									</span>

									<div>
										<strong>Imagem</strong>
										<small>
											Adicione uma
											imagem
										</small>
									</div>
								</button>

								<button
									type="button"
									onClick={() =>
										addBlock('vehicle')
									}
								>
									<span>
										<IoCarSportOutline />
									</span>

									<div>
										<strong>Veículo</strong>
										<small>
											Insira um carro
										</small>
									</div>
								</button>

								<button
									type="button"
									onClick={() =>
										addBlock('divider')
									}
								>
									<span>
										<IoRemoveOutline />
									</span>

									<div>
										<strong>Divisor</strong>
										<small>
											Separar conteúdos
										</small>
									</div>
								</button>
							</div>
						)}
					</div>
				</form>
			</section>

			<input
				ref={fileInputRef}
				type="file"
				accept="image/*"
				className="hidden-file-input"
				onChange={handleImageSelect}
			/>

			{vehiclePicker && (
				<div
					className="vehicle-modal-backdrop"
					onClick={() => setVehiclePicker(null)}
				>
					<div
						className="vehicle-modal"
						onClick={(event) =>
							event.stopPropagation()
						}
					>
						<header className="vehicle-modal-header">
							<div>
								<span>Biblioteca</span>
								<h2>Selecionar veículo</h2>
							</div>

							<button
								type="button"
								onClick={() =>
									setVehiclePicker(null)
								}
							>
								<IoCloseOutline />
							</button>
						</header>

						<div className="vehicle-list">
							{savedCars.map((car) => {
								const selected =
									getVehicle(
										getVehicleIdForBlock(
											blocks,
											vehiclePicker
										)
									)?.id === car.id;

								return (
									<button
										type="button"
										key={car.id}
										className={`vehicle-option ${
											selected
												? 'selected'
												: ''
										}`}
										onClick={() =>
											selectVehicle(
												vehiclePicker,
												car.id
											)
										}
									>
										<div className="vehicle-option-image">
											<img
												src={car.image}
												alt={car.name}
											/>
										</div>

										<div className="vehicle-option-info">
											<span>
												{car.brand}
											</span>

											<strong>
												{car.name}
											</strong>

											<small>
												{car.engine}{' '}
												·{' '}
												{car.power}{' '}
												·{' '}
												{car.type}
											</small>
										</div>

										{selected && (
											<IoCheckmarkOutline />
										)}
									</button>
								);
							})}
						</div>
					</div>
				</div>
			)}
		</main>
	);
}

function getVehicleIdForBlock(blocks, blockId) {
	return (
		blocks.find((block) => block.id === blockId)
			?.vehicleId || null
	);
}