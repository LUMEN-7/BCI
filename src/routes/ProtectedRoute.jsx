import { Navigate, useLocation } from 'react-router-dom';

function readStoredSession() {
    try {
        const accessToken = localStorage.getItem('accessToken');
        const currentUserRaw = localStorage.getItem('currentUser');

        if (!accessToken || !currentUserRaw) {
            return { hasSession: false };
        }

        const currentUser = JSON.parse(currentUserRaw);

        if (!currentUser) {
            return { hasSession: false };
        }

        // Frontend-only guard: this verifies that client session data exists.
        // Actual token validity/authorization must still be enforced by the backend.
        return { hasSession: true };
    } catch {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('currentUser');
        return { hasSession: false };
    }
}

export default function ProtectedRoute({ children }) {
    const location = useLocation();
    const { hasSession } = readStoredSession();

    if (!hasSession) {
        return <Navigate to="/" replace state={{ from: location.pathname }} />;
    }

    return children;
}
