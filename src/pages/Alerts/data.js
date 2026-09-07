import {
    IoInformationCircleOutline,
    IoRefreshOutline,
    IoSettingsOutline,
    IoWarningOutline,
} from 'react-icons/io5';

export const initialAlerts = [
    {
        id: '1',
        type: 'update',
        title: 'Atualização disponível',
        description: 'Novas informações foram adicionadas ao Mustang GT 2024.',
        date: 'Hoje, 14:32',
        read: false,
        route: '/information/1',
    },
    {
        id: '2',
        type: 'attention',
        title: 'Atenção em um veículo salvo',
        description: 'Algumas informações do Bronco 2021 foram atualizadas.',
        date: 'Hoje, 11:18',
        read: false,
        route: '/information/2',
    },
    {
        id: '3',
        type: 'information',
        title: 'Nova comparação disponível',
        description: 'Sua comparação entre Mustang GT 2024 e Bronco 2021 recebeu novos dados.',
        date: 'Ontem, 18:45',
        read: true,
        route: '/compare/detail',
    },
    {
        id: '4',
        type: 'system',
        title: 'Perfil atualizado',
        description: 'Suas informações de perfil foram atualizadas com sucesso.',
        date: '12 Jun, 09:20',
        read: true,
        route: '/profile',
    },
];

export const alertTypeConfig = {
    update: { label: 'Atualização', icon: IoRefreshOutline, className: 'update' },
    attention: { label: 'Atenção', icon: IoWarningOutline, className: 'attention' },
    information: { label: 'Informação', icon: IoInformationCircleOutline, className: 'information' },
    system: { label: 'Sistema', icon: IoSettingsOutline, className: 'system' },
};
