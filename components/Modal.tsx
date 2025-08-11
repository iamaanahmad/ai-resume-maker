import React, { useEffect } from 'react';
import XMarkIcon from './icons/XMarkIcon';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    isDarkMode?: boolean;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, isDarkMode = false }) => {
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-fadeIn"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <div 
                className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col transform animate-slideUp transition-all duration-300`}
                onClick={(e) => e.stopPropagation()}
            >
                <header className={`flex justify-between items-center p-6 border-b ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} sticky top-0 rounded-t-2xl`}>
                    <h2 id="modal-title" className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} tracking-tight`}>
                        {title}
                    </h2>
                    <button 
                        onClick={onClose} 
                        className={`p-2 rounded-xl ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'} transition-all duration-200`}
                        aria-label="Close modal"
                    >
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </header>
                <main className={`p-6 overflow-y-auto ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Modal;
