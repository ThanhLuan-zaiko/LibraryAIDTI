import React from 'react';
import { HiExclamationTriangle, HiInformationCircle, HiExclamationCircle } from 'react-icons/hi2';

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    type?: 'danger' | 'warning' | 'info';
    showCancel?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    title,
    message,
    confirmText = 'Xác nhận',
    cancelText = 'Hủy bỏ',
    onConfirm,
    onCancel,
    type = 'danger',
    showCancel = true
}) => {
    if (!isOpen) return null;

    const config = {
        danger: {
            icon: <HiExclamationTriangle className="h-7 w-7 text-red-600" />,
            iconBg: 'bg-red-100',
            buttonBase: 'bg-red-600 hover:bg-red-700',
        },
        warning: {
            icon: <HiExclamationTriangle className="h-7 w-7 text-amber-600" />,
            iconBg: 'bg-amber-100',
            buttonBase: 'bg-amber-600 hover:bg-amber-700',
        },
        info: {
            icon: <HiInformationCircle className="h-7 w-7 text-blue-600" />,
            iconBg: 'bg-blue-100',
            buttonBase: 'bg-blue-600 hover:bg-blue-700',
        }
    };

    const currentConfig = config[type] || config.danger;

    return (
        <div className="fixed inset-0 z-[100] overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
                onClick={onCancel}
            />

            {/* Modal Container */}
            <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                <div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-md animate-in zoom-in-95 duration-300">
                    <div className="bg-white px-6 pt-6 pb-4 sm:p-8 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className={`mx-auto flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full ${currentConfig.iconBg} sm:mx-0 sm:h-12 sm:w-12`}>
                                {currentConfig.icon}
                            </div>
                            <div className="mt-4 text-center sm:mt-0 sm:ml-5 sm:text-left">
                                <h3 className="text-xl font-bold leading-6 text-gray-900">
                                    {title}
                                </h3>
                                <div className="mt-3">
                                    <p className="text-sm text-gray-500 font-medium leading-relaxed">
                                        {message}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50/50 px-6 py-4 flex flex-col-reverse sm:flex-row sm:justify-end sm:gap-3">
                        {showCancel && (
                            <button
                                type="button"
                                className="mt-3 inline-flex w-full justify-center rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto transition-all active:scale-95"
                                onClick={onCancel}
                            >
                                {cancelText}
                            </button>
                        )}
                        <button
                            type="button"
                            className={`inline-flex w-full justify-center rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-md sm:w-auto transition-all active:scale-95 hover:shadow-lg ${currentConfig.buttonBase}`}
                            onClick={onConfirm}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
