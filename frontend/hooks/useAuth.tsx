"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '@/services/auth.service';
import AccountLockedModal from '@/components/auth/AccountLockedModal';
import PermissionUpdateModal from '@/components/auth/PermissionUpdateModal';
import { usePathname, useRouter } from 'next/navigation';

interface Role {
    id: string;
    name: string;
    description: string;
}

interface User {
    id: string;
    email: string;
    full_name: string;
    roles: Role[];
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (data: any) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isLocked, setIsLocked] = useState(false);
    const [permissionModal, setPermissionModal] = useState<{ isOpen: boolean; type: 'promoted' | 'demoted' }>({
        isOpen: false,
        type: 'promoted'
    });

    const pathname = usePathname();
    const router = useRouter();

    const userRef = React.useRef<User | null>(user);
    const pathnameRef = React.useRef(pathname);

    useEffect(() => {
        userRef.current = user;
    }, [user]);

    useEffect(() => {
        pathnameRef.current = pathname;
    }, [pathname]);

    const refreshUser = async () => {
        try {
            const data = await authService.getMe();
            const newUser = data.user;
            const currentUser = userRef.current;
            const currentPath = pathnameRef.current;

            if (currentUser && newUser) {
                const oldRoles = currentUser.roles || [];
                const newRoles = newUser.roles || [];

                const privilegedRoles = ['ADMIN', 'EDITOR', 'AUTHOR'];

                // Helper to check if any role matches privileged roles
                const hasPrivilege = (roles: Role[]) =>
                    roles.some((r: Role) => r && r.name && privilegedRoles.includes(r.name));

                const hadPrivileged = hasPrivilege(oldRoles);
                const hasPrivileged = hasPrivilege(newRoles);

                const lostPrivileged = hadPrivileged && !hasPrivileged;
                const gainedPrivileged = !hadPrivileged && hasPrivileged;

                // If currently on admin route and lost all privileged roles
                if (lostPrivileged && currentPath?.startsWith('/admin')) {
                    setPermissionModal({ isOpen: true, type: 'demoted' });
                    // Do not update user state yet, to keep them on the page for the notification
                    return;
                } else if (gainedPrivileged) {
                    // Show promotion notification if not on admin page
                    if (!currentPath?.startsWith('/admin')) {
                        setPermissionModal({ isOpen: true, type: 'promoted' });
                    }
                }
            }

            setUser(newUser);
        } catch (error: any) {
            // Only log if it's not a 401 (Unauthorized) to avoid dev overlay for guests
            if (error.response?.status !== 401) {
                console.error("Không thể tải thông tin người dùng:", error);
            }
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    // Initial user fetch
    useEffect(() => {
        refreshUser();
    }, []);

    // WebSocket connection management
    useEffect(() => {
        let socket: WebSocket | null = null;

        if (user && !isLocked) {
            // Establish WebSocket connection
            const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
            // Extract only the domain and port from API_URL
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
            const host = apiUrl.replace(/^https?:\/\//, "").split('/')[0];

            const wsUrl = `${protocol}//${host}/api/v1/ws`;
            socket = new WebSocket(wsUrl);

            socket.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (data.type === "account_locked") {
                        setIsLocked(true);
                    } else if (data.type === "role_updated") {
                        refreshUser();
                    }
                } catch (err) {
                    console.error("Error parsing WS message:", err);
                }
            };

            socket.onclose = () => {
                console.log("WebSocket disconnected");
            };

            socket.onerror = (err) => {
                console.error("WebSocket error:", err);
            };
        }

        return () => {
            if (socket) {
                socket.close();
            }
        };
    }, [user?.id, isLocked]);

    // Global event listener
    useEffect(() => {
        const handleLockEvent = () => setIsLocked(true);
        window.addEventListener("account-locked", handleLockEvent);

        return () => {
            window.removeEventListener("account-locked", handleLockEvent);
        };
    }, []);

    const login = async (data: any) => {
        const res = await authService.login(data);
        setUser(res.user);
    };

    const logout = async () => {
        await authService.logout();
        setUser(null);
        setIsLocked(false);
        setPermissionModal({ isOpen: false, type: 'promoted' });
        if (typeof window !== "undefined") {
            window.location.href = "/";
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
            {children}
            <AccountLockedModal isOpen={isLocked} onLogout={logout} />
            <PermissionUpdateModal
                isOpen={permissionModal.isOpen}
                type={permissionModal.type}
                onRedirect={() => {
                    setPermissionModal({ ...permissionModal, isOpen: false });
                    if (permissionModal.type === 'demoted') {
                        router.push('/');
                        // Trigger refresh to update state after navigation
                        setTimeout(() => refreshUser(), 500);
                    }
                }}
            />
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
