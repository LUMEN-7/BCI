import { jwtDecode } from 'jwt-decode';

export function getCurrentUserRoles() {
    const token = localStorage.getItem('accessToken');
    if (!token) return [];

    try {
        const payload = jwtDecode(token);
        // .NET costuma mapear "role" pra essa URI longa em vez do nome curto — confere qual das duas aparece
        const roleClaim = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ?? payload.role;
        if (!roleClaim) return [];
        return Array.isArray(roleClaim) ? roleClaim : [roleClaim];
    } catch {
        return [];
    }
}

export function isAdmin() {
    return getCurrentUserRoles().includes('Admin');
}