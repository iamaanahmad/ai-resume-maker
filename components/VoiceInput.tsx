import React, { useState, useEffect, useRef } from 'react';

interface VoiceInputProps {
    onTranscript: (text: string) => void;
    isListening: boolean;
    onListeningChange: (listening: boolean) => void;
    placeholder?: string;
}

const VoiceInput: React.FC<VoiceInputProps> = ({
    onTranscript,
    isListening,
    onListeningChange,
    placeholder = "Click the microphone to start voice input"
}) => {
    const [isSupported, setIsSupported] = useState(false);
    const [recognition, setRecognition] = useState<any>(null);
    const [isPaused, setIsPaused] = useState(false);
    const [interimTranscript, setInterimTranscript] = useState('');
    const recognitionRef = useRef<any>(null);
    const restartTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Check if speech recognition is supported
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        
        if (SpeechRecognition) {
            setIsSupported(true);
            const recognitionInstance = new SpeechRecognition();
            recognitionInstance.continuous = true;
            recognitionInstance.interimResults = true;
            recognitionInstance.lang = 'en-US';
            recognitionInstance.maxAlternatives = 1;

            recognitionInstance.onstart = () => {
                setIsPaused(false);
            };

            recognitionInstance.onresult = (event: any) => {
                let finalTranscript = '';
                let interim = '';
                
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        finalTranscript += transcript;
                    } else {
                        interim += transcript;
                    }
                }
                
                setInterimTranscript(interim);
                
                if (finalTranscript) {
                    onTranscript(finalTranscript);
                    setInterimTranscript('');
                }
            };

            recognitionInstance.onerror = (event: any) => {
                console.warn('Speech recognition error:', event.error);
                if (event.error === 'no-speech' || event.error === 'audio-capture') {
                    // Auto-restart on common errors if still listening
                    if (isListening && !isPaused) {
                        restartRecognition();
                    }
                } else {
                    onListeningChange(false);
                    setIsPaused(false);
                }
            };

            recognitionInstance.onend = () => {
                // Auto-restart if we're supposed to be listening and not paused
                if (isListening && !isPaused) {
                    restartRecognition();
                } else {
                    onListeningChange(false);
                    setIsPaused(false);
                }
            };

            setRecognition(recognitionInstance);
            recognitionRef.current = recognitionInstance;
        }

        return () => {
            if (restartTimeoutRef.current) {
                clearTimeout(restartTimeoutRef.current);
            }
        };
    }, [onTranscript, onListeningChange, isListening, isPaused]);

    const restartRecognition = () => {
        if (restartTimeoutRef.current) {
            clearTimeout(restartTimeoutRef.current);
        }
        
        restartTimeoutRef.current = setTimeout(() => {
            if (recognitionRef.current && isListening && !isPaused) {
                try {
                    recognitionRef.current.start();
                } catch (error) {
                    console.warn('Failed to restart recognition:', error);
                }
            }
        }, 100);
    };

    const startListening = () => {
        if (!recognition) return;
        
        try {
            recognition.start();
            onListeningChange(true);
            setIsPaused(false);
        } catch (error) {
            console.warn('Failed to start recognition:', error);
        }
    };

    const stopListening = () => {
        if (!recognition) return;
        
        recognition.stop();
        onListeningChange(false);
        setIsPaused(false);
        setInterimTranscript('');
        
        if (restartTimeoutRef.current) {
            clearTimeout(restartTimeoutRef.current);
        }
    };

    const pauseListening = () => {
        if (!recognition) return;
        
        setIsPaused(true);
        recognition.stop();
        
        if (restartTimeoutRef.current) {
            clearTimeout(restartTimeoutRef.current);
        }
    };

    const resumeListening = () => {
        if (!recognition) return;
        
        setIsPaused(false);
        try {
            recognition.start();
        } catch (error) {
            console.warn('Failed to resume recognition:', error);
        }
    };

    const toggleListening = () => {
        if (!recognition) return;

        if (isListening) {
            if (isPaused) {
                resumeListening();
            } else {
                pauseListening();
            }
        } else {
            startListening();
        }
    };

    const handleStop = () => {
        stopListening();
    };

    if (!isSupported) {
        return (
            <div className="text-xs text-gray-500 italic p-2 bg-gray-100 rounded-lg" role="alert">
                Voice input not supported in this browser
            </div>
        );
    }

    const getButtonColor = () => {
        if (!isListening) return 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600';
        if (isPaused) return 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600';
        return 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 animate-pulse';
    };

    const getStatusText = () => {
        if (!isListening) return '🎙️ Voice Input';
        if (isPaused) return '⏸️ Paused';
        return '🎤 Listening...';
    };

    const getStatusDescription = () => {
        if (!isListening) return placeholder;
        if (isPaused) return 'Click to resume listening';
        return interimTranscript || 'Speak now, your words will be added to the text';
    };

    return (
        <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200" role="region" aria-label="Voice input controls">
            <button
                type="button"
                onClick={toggleListening}
                className={`p-2 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${getButtonColor()}`}
                title={isListening ? (isPaused ? 'Resume listening' : 'Pause listening') : 'Start voice input'}
                aria-label={isListening ? (isPaused ? 'Resume voice input' : 'Pause voice input') : 'Start voice input'}
                aria-pressed={isListening}
            >
                {!isListening ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                    </svg>
                ) : isPaused ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                ) : (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                )}
            </button>
            
            {isListening && (
                <button
                    type="button"
                    onClick={handleStop}
                    className="p-2 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg text-white bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    title="Stop listening"
                    aria-label="Stop voice input"
                >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                    </svg>
                </button>
            )}
            
            <div className="flex-1 min-w-0">
                <span className={`text-sm font-medium ${isListening ? (isPaused ? 'text-yellow-600' : 'text-green-600') : 'text-blue-600'}`} role="status" aria-live="polite">
                    {getStatusText()}
                </span>
                <p className="text-xs text-gray-500 mt-1 truncate" aria-live="polite">
                    {getStatusDescription()}
                </p>
            </div>
        </div>
    );
};

export default VoiceInput;