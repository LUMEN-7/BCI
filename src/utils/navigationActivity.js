import {
  IoBookmarkOutline,
  IoDocumentTextOutline,
  IoGitCompareOutline,
  IoGridOutline,
  IoHomeOutline,
  IoNotificationsOutline,
  IoPersonOutline,
  IoSearchOutline,
  IoSettingsOutline,
  IoStatsChartOutline,
} from 'react-icons/io5';

import { cars as informationCars } from '../pages/Information/data';
import { getUserScopedItem, setUserScopedItem } from './userScopedStorage';

export const RECENT_ACTIVITY_STORAGE_KEY = 'recentNavigationActivities';

const ROUTE_ACTIVITY_MAP = {
  '/': { label: 'Login', type: 'ACESSO', icon: IoPersonOutline },
  '/home': { label: 'Início', type: 'INÍCIO', icon: IoHomeOutline },
  '/search': { label: 'Pesquisa', type: 'PESQUISA', icon: IoSearchOutline },
  '/compare': { label: 'Comparar veículos', type: 'COMPARAÇÃO', icon: IoGitCompareOutline },
  '/saved': { label: 'Veículos salvos', type: 'SALVOS', icon: IoBookmarkOutline },
  '/notes': { label: 'Anotações', type: 'ANOTAÇÕES', icon: IoDocumentTextOutline },
  '/alerts': { label: 'Alertas', type: 'ALERTAS', icon: IoNotificationsOutline },
  '/profile': { label: 'Perfil', type: 'PERFIL', icon: IoPersonOutline },
  '/edit-profile': { label: 'Editar perfil', type: 'PERFIL', icon: IoSettingsOutline },
  '/reset-password': { label: 'Recuperar senha', type: 'SENHA', icon: IoSettingsOutline },
  '/workspace': { label: 'Workspace', type: 'WORKSPACE', icon: IoGridOutline },
  '/register': { label: 'Cadastro', type: 'CADASTRO', icon: IoPersonOutline },
};

function normalizePath(pathname) {
  if (!pathname) return '/';
  return pathname.split('?')[0].split('#')[0] || '/';
}

function getRouteFallbackLabel(pathname) {
  const rawPath = normalizePath(pathname).replace(/^\//, '').replace(/\//g, ' ');
  if (!rawPath) return 'Início';

  return rawPath
    .split(' ')
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
}

function getInformationCarMeta(pathname, routeState = {}) {
  const match = normalizePath(pathname).match(/^\/information\/(.+)$/);
  if (!match) return null;

  const routeCar = routeState?.car || routeState?.firstCar || routeState?.vehicle;
  const carName = routeCar?.name || routeCar?.modelo || routeCar?.model || routeCar?.title;

  if (carName) {
    return {
      label: carName,
      type: 'INFORMAÇÃO',
      icon: IoSearchOutline,
    };
  }

  const carId = match[1];
  const car = informationCars.find((item) => String(item.id) === String(carId));

  if (!car) return null;

  return {
    label: car.name,
    type: 'INFORMAÇÃO',
    icon: IoSearchOutline,
  };
}

function getComparisonMeta(routeState) {
  const firstCar = routeState?.firstCar;
  const secondCar = routeState?.secondCar;

  if (!firstCar && !secondCar) {
    return {
      label: 'Comparação de veículos',
      type: 'COMPARAÇÃO',
      icon: IoGitCompareOutline,
    };
  }

  const firstName = firstCar?.name || 'Veículo 1';
  const secondName = secondCar?.name || 'Veículo 2';

  return {
    label: `${firstName} x ${secondName}`,
    type: 'COMPARAÇÃO',
    icon: IoGitCompareOutline,
  };
}

export function getActivityMetaByPath(pathname, routeState = {}) {
  const normalizedPath = normalizePath(pathname);

  if (normalizedPath.startsWith('/information/')) {
    const infoMeta = getInformationCarMeta(normalizedPath, routeState);
    if (infoMeta) return infoMeta;
  }

  if (normalizedPath === '/compare/detail') {
    return getComparisonMeta(routeState);
  }

  if (normalizedPath === '/search' || normalizedPath === '/compare' || normalizedPath === '/home' || normalizedPath === '/welcome') {
    return null;
  }

  const routeMeta = ROUTE_ACTIVITY_MAP[normalizedPath] || {
    label: getRouteFallbackLabel(normalizedPath),
    type: 'NAVEGAÇÃO',
    icon: IoStatsChartOutline,
  };

  return routeMeta;
}

export function getStoredNavigationActivities() {
  try {
    const stored = getUserScopedItem(RECENT_ACTIVITY_STORAGE_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((activity) => activity?.path && activity?.timestamp)
      .map((activity) => {
        const meta = getActivityMetaByPath(activity.path, activity.routeState || {});

        if (!meta) return null;

        return {
          ...meta,
          path: activity.path,
          timestamp: activity.timestamp,
          routeState: activity.routeState,
        };
      })
      .filter(Boolean)
      .slice(0, 3);
  } catch {
    return [];
  }
}

export function appendNavigationActivity(pathname, routeState = {}) {
  const normalizedPath = normalizePath(pathname);
  const currentHistory = getStoredNavigationActivities();
  const routeMeta = getActivityMetaByPath(normalizedPath, routeState);

  if (!routeMeta) {
    return currentHistory;
  }

  const lastActivity = currentHistory[0];
  const nextActivity = {
    ...routeMeta,
    path: normalizedPath,
    timestamp: new Date().toISOString(),
    routeState,
  };

  if (
    lastActivity?.path === normalizedPath &&
    lastActivity?.label === nextActivity.label &&
    lastActivity?.type === nextActivity.type
  ) {
    return currentHistory;
  }

  const nextHistory = [
    nextActivity,
    ...currentHistory.filter((activity) => !(activity.path === normalizedPath && activity.label === nextActivity.label)),
  ].slice(0, 3);

  setUserScopedItem(RECENT_ACTIVITY_STORAGE_KEY, JSON.stringify(nextHistory));
  window.dispatchEvent(new CustomEvent('navigation-activity-updated', { detail: nextHistory }));

  return nextHistory;
}
