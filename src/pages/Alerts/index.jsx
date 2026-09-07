import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	IoArrowBackOutline,
	IoNotificationsOutline,
	IoCheckmarkDoneOutline,
	IoCheckmarkOutline,
	IoTrashOutline,
	IoInformationCircleOutline,
	IoWarningOutline,
	IoRefreshOutline,
	IoSettingsOutline,
} from 'react-icons/io5';

import './style.css';
import Navbar from '../../components/Navbar/Navbar';

const initialAlerts = [
	{
		id: '1',
		type: 'update',
		title: 'Atualização disponível',
		description:
			'Novas informações foram adicionadas ao Mustang GT 2024.',
		date: 'Hoje, 14:32',
		read: false,
		route: '/information/1',
	},

	{
		id: '2',
		type: 'attention',
		title: 'Atenção em um veículo salvo',
		description:
			'Algumas informações do Bronco 2021 foram atualizadas.',
		date: 'Hoje, 11:18',
		read: false,
		route: '/information/2',
	},

	{
		id: '3',
		type: 'information',
		title: 'Nova comparação disponível',
		description:
			'Sua comparação entre Mustang GT 2024 e Bronco 2021 recebeu novos dados.',
		date: 'Ontem, 18:45',
		read: true,
		route: '/compare/detail',
	},

	{
		id: '4',
		type: 'system',
		title: 'Perfil atualizado',
		description:
			'Suas informações de perfil foram atualizadas com sucesso.',
		date: '12 Jun, 09:20',
		read: true,
		route: '/profile',
	},
];

const typeConfig = {
	update: {
		label: 'Atualização',
		icon: <IoRefreshOutline />,
		className: 'update',
	},

	attention: {
		label: 'Atenção',
		icon: <IoWarningOutline />,
		className: 'attention',
	},

	information: {
		label: 'Informação',
		icon: <IoInformationCircleOutline />,
		className: 'information',
	},

	system: {
		label: 'Sistema',
		icon: <IoSettingsOutline />,
		className: 'system',
	},
};

export default function Alerts() {
	const navigate = useNavigate();

	const [alerts, setAlerts] = useState(() => {
		const storedAlerts = localStorage.getItem('alerts');

		if (storedAlerts) {
			return JSON.parse(storedAlerts);
		}

		localStorage.setItem('alerts', JSON.stringify(initialAlerts));

		return initialAlerts;
	});

	const [activeFilter, setActiveFilter] = useState('all');

	const unreadCount = alerts.filter((alert) => !alert.read).length;

	const filteredAlerts = useMemo(() => {
		if (activeFilter === 'unread') {
			return alerts.filter((alert) => !alert.read);
		}

		return alerts;
	}, [alerts, activeFilter]);

	function updateAlerts(nextAlerts) {
		setAlerts(nextAlerts);
		localStorage.setItem('alerts', JSON.stringify(nextAlerts));
	}

	function markAsRead(id) {
		const nextAlerts = alerts.map((alert) =>
			alert.id === id
				? {
						...alert,
						read: true,
					}
				: alert
		);

		updateAlerts(nextAlerts);
	}

	function markAllAsRead() {
		const nextAlerts = alerts.map((alert) => ({
			...alert,
			read: true,
		}));

		updateAlerts(nextAlerts);
	}

	function deleteAlert(id) {
		const nextAlerts = alerts.filter((alert) => alert.id !== id);

		updateAlerts(nextAlerts);
	}

	function handleAlertClick(alert) {
		if (!alert.read) {
			markAsRead(alert.id);
		}

		if (alert.route) {
			navigate(alert.route);
		}
	}

	return (
		<main className="alerts-page">
			<Navbar />

			<section className="alerts-container">
				<header className="alerts-header">
					<div>
						<p className="alerts-eyebrow">
							Central de notificações
						</p>

						<h1>Alertas</h1>

						<p className="alerts-description">
							Acompanhe atualizações, mudanças e informações
							importantes dos seus veículos.
						</p>
					</div>

					{unreadCount > 0 && (
						<button
							type="button"
							className="mark-all-button"
							onClick={markAllAsRead}
						>
							<IoCheckmarkDoneOutline />
							Marcar todas como lidas
						</button>
					)}
				</header>

				<div className="alerts-summary">
					<div className="alerts-summary-icon">
						<IoNotificationsOutline />
					</div>

					<div className="alerts-summary-content">
						<span>Notificações pendentes</span>

						<strong>
							{unreadCount === 0
								? 'Tudo em dia'
								: `${unreadCount} ${
										unreadCount === 1
											? 'alerta não lido'
											: 'alertas não lidos'
									}`}
						</strong>
					</div>
				</div>

				<div className="alerts-toolbar">
					<div className="alerts-filters">
						<button
							type="button"
							className={
								activeFilter === 'all' ? 'active' : ''
							}
							onClick={() => setActiveFilter('all')}
						>
							Todos
							<span>{alerts.length}</span>
						</button>

						<button
							type="button"
							className={
								activeFilter === 'unread' ? 'active' : ''
							}
							onClick={() => setActiveFilter('unread')}
						>
							Não lidos
							<span>{unreadCount}</span>
						</button>
					</div>
				</div>

				<section className="alerts-list">
					{filteredAlerts.length > 0 ? (
						filteredAlerts.map((alert) => {
							const config =
								typeConfig[alert.type] ||
								typeConfig.information;

							return (
								<article
									key={alert.id}
									className={`alert-card ${
										!alert.read ? 'is-unread' : ''
									}`}
									onClick={() =>
										handleAlertClick(alert)
									}
								>
									<div
										className={`alert-icon ${config.className}`}
									>
										{config.icon}
									</div>

									<div className="alert-content">
										<div className="alert-top">
											<div className="alert-type">
												{!alert.read && (
													<span className="unread-dot" />
												)}

												<span>
													{config.label}
												</span>
											</div>

											<small>{alert.date}</small>
										</div>

										<h2>{alert.title}</h2>

										<p>{alert.description}</p>
									</div>

									<div className="alert-actions">
										{!alert.read && (
											<button
												type="button"
												className="read-button"
												title="Marcar como lida"
												onClick={(event) => {
													event.stopPropagation();
													markAsRead(alert.id);
												}}
											>
												<IoCheckmarkOutline />
											</button>
										)}

										<button
											type="button"
											className="delete-alert-button"
											title="Excluir alerta"
											onClick={(event) => {
												event.stopPropagation();
												deleteAlert(alert.id);
											}}
										>
											<IoTrashOutline />
										</button>
									</div>
								</article>
							);
						})
					) : (
						<div className="alerts-empty">
							<div className="alerts-empty-icon">
								<IoCheckmarkDoneOutline />
							</div>

							<h2>
								{activeFilter === 'unread'
									? 'Tudo lido'
									: 'Nenhum alerta'}
							</h2>

							<p>
								{activeFilter === 'unread'
									? 'Você não possui notificações pendentes.'
									: 'Novos alertas aparecerão aqui.'}
							</p>
						</div>
					)}
				</section>
			</section>
		</main>
	);
}