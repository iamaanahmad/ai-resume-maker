import React from 'react';
import { ToneStyle } from '../types';

interface SettingsPanelProps {
    toneStyle: ToneStyle;
    onToneStyleChange: (tone: ToneStyle) => void;
    isDarkMode: boolean;
    onDarkModeToggle: () => void;
    isBeginnerMode: boolean;
    onBeginnerModeToggle: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
    toneStyle,
    onToneStyleChange,
    isDarkMode,
    onDarkModeToggle,
    isBeginnerMode,
    onBeginnerModeToggle
}) => {
    return (
        <div className={`${isDarkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-gray-200'} backdrop-blur-md border rounded-2xl shadow-xl transition-all duration-500`}>
            <details className="group">
                <summary className={`p-6 font-semibold text-lg ${isDarkMode ? 'text-white' : 'text-gray-800'} cursor-pointer list-none flex justify-between items-center hover:${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50/50'} rounded-2xl transition-all duration-300`}>
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${isDarkMode ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'bg-gradient-to-r from-purple-500 to-pink-500'} shadow-lg`}>
                            <span className="text-white text-lg">⚙️</span>
                        </div>
                        <span>Settings & Preferences</span>
                    </div>
                    <span className="transition-transform transform group-open:rotate-180 duration-300">
                        <svg className={`w-6 h-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                    </span>
                </summary>
                <div className="px-6 pb-6 space-y-6">
                    {/* Tone Style Selector */}
                    <div>
                        <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-3`}>
                            <span className="flex items-center gap-2">
                                <span className="text-lg">🎨</span>
                                Writing Tone & Style
                            </span>
                        </label>
                        <select
                            value={toneStyle}
                            onChange={(e) => onToneStyleChange(e.target.value as ToneStyle)}
                            className={`w-full p-3 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-xl shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300`}
                        >
                            <option value={ToneStyle.FORMAL}>🏢 Formal - Corporate & Professional</option>
                            <option value={ToneStyle.CREATIVE}>🎭 Creative - Engaging & Innovative</option>
                            <option value={ToneStyle.ACADEMIC}>🎓 Academic - Research & Scholarly</option>
                            <option value={ToneStyle.TECHNICAL}>⚡ Technical - Precise & Data-Driven</option>
                        </select>
                        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-2 flex items-center gap-1`}>
                            <span>💡</span>
                            This affects how AI refines your content to match your industry
                        </p>
                    </div>

                    {/* Mode Toggles */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className={`flex items-center justify-between p-4 ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'} rounded-xl border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} transition-all duration-300 hover:shadow-md`}>
                            <div>
                                <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} flex items-center gap-2`}>
                                    <span className="text-lg">🎯</span>
                                    Beginner Mode
                                </label>
                                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                                    Show helpful tips & examples
                                </p>
                            </div>
                            <button
                                onClick={onBeginnerModeToggle}
                                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${isDarkMode ? 'focus:ring-offset-gray-800' : 'focus:ring-offset-white'} ${
                                    isBeginnerMode ? 'bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg' : isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
                                }`}
                            >
                                <span
                                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
                                        isBeginnerMode ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                                />
                            </button>
                        </div>

                        <div className={`flex items-center justify-between p-4 ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'} rounded-xl border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} transition-all duration-300 hover:shadow-md`}>
                            <div>
                                <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} flex items-center gap-2`}>
                                    <span className="text-lg">{isDarkMode ? '🌙' : '☀️'}</span>
                                    Dark Mode
                                </label>
                                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                                    Easy on the eyes
                                </p>
                            </div>
                            <button
                                onClick={onDarkModeToggle}
                                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${isDarkMode ? 'focus:ring-offset-gray-800' : 'focus:ring-offset-white'} ${
                                    isDarkMode ? 'bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg' : 'bg-gray-300'
                                }`}
                            >
                                <span
                                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
                                        isDarkMode ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                                />
                            </button>
                        </div>
                    </div>
                </div>
            </details>
        </div>
    );
};

export default SettingsPanel;