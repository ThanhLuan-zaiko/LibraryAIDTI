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
    onlineUsers: Set<string>;
    socket: WebSocket | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isLocked, setIsLocked] = useState(false);
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
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

                const hasPrivilege = (roles: Role[]) =>
                    roles.some((r: Role) => r && r.name && privilegedRoles.includes(r.name));

                const hadPrivileged = hasPrivilege(oldRoles);
                const hasPrivileged = hasPrivilege(newRoles);

                const lostPrivileged = hadPrivileged && !hasPrivileged;
                const gainedPrivileged = !hadPrivileged && hasPrivileged;

                if (lostPrivileged && currentPath?.startsWith('/admin')) {
                    setPermissionModal({ isOpen: true, type: 'demoted' });
                    return;
                } else if (gainedPrivileged) {
                    if (!currentPath?.startsWith('/admin')) {
                        setPermissionModal({ isOpen: true, type: 'promoted' });
                    }
                }
            }

            setUser(newUser);
        } catch (error: any) {
            if (error.response?.status !== 401) {
                console.error("Failed to load user info:", error);
            }
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshUser();
    }, []);

    // WebSocket connection management
    useEffect(() => {
        let localSocket: WebSocket | null = null;

        if (user && !isLocked) {
            const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
            const host = apiUrl.replace(/^https?:\/\//, "").split('/')[0];
            const wsUrl = `${protocol}//${host}/api/v1/ws`;

            try {
                const ws = new WebSocket(wsUrl);
                setSocket(ws);
                localSocket = ws;

                ws.onmessage = (event) => {
                    try {
                        const data = JSON.parse(event.data);
                        if (data.type === "account_locked") {
                            setIsLocked(true);
                        } else if (data.type === "role_updated") {
                            refreshUser();
                        } else if (data.type === "online_list") {
                            const ids = (data.payload.user_ids || []) as string[];
                            setOnlineUsers(new Set(ids));
                        } else if (data.type === "user_status") {
                            const { user_id, status } = data.payload;
                            setOnlineUsers(prev => {
                                const newSet = new Set(prev);
                                if (status === "online") {
                                    newSet.add(user_id);
                                } else {
                                    newSet.delete(user_id);
                                }
                                return newSet;
                            });
                        }
                    } catch (err) {
                        console.error("WS message parse error:", err);
                    }
                };

                ws.onerror = (err) => {
                    console.error("WS connection error:", err);
                };
            } catch (err) {
                console.error("Failed to establish WS connection:", err);
            }
        }

        return () => {
            if (localSocket) {
                localSocket.close();
            }
            setSocket(null);
        };
    }, [user?.id, isLocked]);

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
        <AuthContext.Provider value={{ user, loading, login, logout, refreshUser, onlineUsers, socket }}>
            {children}
            <AccountLockedModal isOpen={isLocked} onLogout={logout} />
            <PermissionUpdateModal
                isOpen={permissionModal.isOpen}
                type={permissionModal.type}
                onRedirect={() => {
                    setPermissionModal({ ...permissionModal, isOpen: false });
                    if (permissionModal.type === 'demoted') {
                        router.push('/');
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
