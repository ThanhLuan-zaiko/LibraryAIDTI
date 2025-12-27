"use client";

import { FiAlertTriangle } from "react-icons/fi";

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    type?: "danger" | "warning" | "info";
    loading?: boolean;
}

export default function ConfirmModal({
    isOpen,
    title,
    message,
    confirmText = "Xác nhận",
    cancelText = "Hủy",
    onConfirm,
    onCancel,
    type = "danger",
    loading = false
}: ConfirmModalProps) {
    if (!isOpen) return null;

    const colors = {
        danger: {
            bg: "bg-red-50",
            icon: "text-red-600",
            button: "bg-red-600 hover:bg-red-700",
            border: "border-red-100"
        },
        warning: {
            bg: "bg-yellow-50",
            icon: "text-yellow-600",
            button: "bg-yellow-600 hover:bg-yellow-700",
            border: "border-yellow-100"
        },
        info: {
            bg: "bg-blue-50",
            icon: "text-blue-600",
            button: "bg-blue-600 hover:bg-blue-700",
            border: "border-blue-100"
        }
    };

    const style = colors[type];

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
                <div className={`p-6 ${style.bg} flex justify-center`}>
                    <div className={`w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm ${style.icon}`}>
                        <FiAlertTriangle size={32} />
                    </div>
                </div>
                <div className="p-6 text-center">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{message}</p>
                </div>
                <div className="p-6 pt-0 flex space-x-3">
                    <button
                        onClick={onCancel}
                        disabled={loading}
                        className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl font-semibold hover:bg-gray-50 transition-all disabled:opacity-50"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className={`flex-1 px-4 py-2.5 text-white rounded-xl font-semibold transition-all shadow-sm ${style.button} disabled:opacity-50 flex items-center justify-center`}
                    >
                        {loading && (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                        )}
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
