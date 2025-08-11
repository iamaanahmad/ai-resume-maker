import React, { useState, useEffect } from 'react';

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

    useEffect(() => {
        // Check if speech recognition is supported
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        
        if (SpeechRecognition) {
            setIsSupported(true);
            const recognitionInstance = new SpeechRecognition();
            recognitionInstance.continuous = true;
            recognitionInstance.interimResults = true;
            recognitionInstance.lang = 'en-US';

            recognitionInstance.onresult = (event: any) => {
                let finalTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    }
                }
                if (finalTranscript) {
                    onTranscript(finalTranscript);
                }
            };

            recognitionInstance.onerror = (event: any) => {
                // Speech recognition errors are common and expected, no need to log them
                onListeningChange(false);
            };

            recognitionInstance.onend = () => {
                onListeningChange(false);
            };

            setRecognition(recognitionInstance);
        }
    }, [onTranscript, onListeningChange]);

    const toggleListening = () => {
        if (!recognition) return;

        if (isListening) {
            recognition.stop();
            onListeningChange(false);
        } else {
            recognition.start();
            onListeningChange(true);
        }
    };

    if (!isSupported) {
        return (
            <div className="text-xs text-gray-500 italic">
                Voice input not supported in this browser
            </div>
        );
    }

    return (
        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
            <button
                type="button"
                onClick={toggleListening}
                className={`p-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg ${
                    isListening 
                        ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white animate-pulse shadow-red-200' 
                        : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 shadow-blue-200'
                }`}
                title={isListening ? 'Stop listening' : 'Start voice input'}
            >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                </svg>
            </button>
            <div className="flex-1">
                <span className={`text-sm font-medium ${isListening ? 'text-red-600' : 'text-blue-600'}`}>
                    {isListening ? '🎤 Listening...' : '🎙️ Voice Input'}
                </span>
                <p className="text-xs text-gray-500 mt-1">
                    {isListening ? 'Speak now, your words will be added to the text' : placeholder}
                </p>
            </div>
        </div>
    );
};

export default VoiceInput;