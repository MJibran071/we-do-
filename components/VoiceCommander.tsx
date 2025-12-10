
import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Loader2, CheckCircle2, AlertCircle, Sparkles, Command, Volume2, X } from 'lucide-react';
import { Button } from './ui/button';
import { processCopilotVoiceCommand } from '../services/geminiService';
import { Apartment, Restaurant, VoiceCommand, AppMode } from '../types';
import { getTheme } from '../utils/theme';
import { Card, CardContent } from './ui/card';

interface VoiceCommanderProps {
    onCommand: (command: VoiceCommand) => void;
    apartments: Apartment[];
    restaurants: Restaurant[];
    appMode: AppMode;
    variant?: 'fab' | 'inline';
}

const AudioVisualizer = ({ isActive }: { isActive: boolean }) => {
    return (
        <div className="flex items-center gap-1 h-6">
            {[...Array(5)].map((_, i) => (
                <div
                    key={i}
                    className={`w-1 bg-white/80 rounded-full transition-all duration-300 ${isActive ? 'animate-music-bar' : 'h-1 opacity-50'}`}
                    style={{ 
                        animationDelay: `${i * 0.1}s`,
                        height: isActive ? undefined : '4px'
                    }}
                />
            ))}
        </div>
    );
};

export const VoiceCommander: React.FC<VoiceCommanderProps> = ({ onCommand, apartments, restaurants, appMode, variant = 'fab' }) => {
    const theme = getTheme(appMode);
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: mediaRecorder.mimeType || 'audio/webm' });
                const reader = new FileReader();
                reader.readAsDataURL(audioBlob);
                reader.onloadend = async () => {
                    const base64String = (reader.result as string).split(',')[1];
                    await processAudio(base64String, mediaRecorder.mimeType || 'audio/webm');
                };
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
            setFeedback(null);
            setTranscript('');
        } catch (error) {
            console.error("Error starting recording:", error);
            setFeedback({ type: 'error', message: "Microphone access denied." });
            setTimeout(() => setFeedback(null), 3000);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            setIsProcessing(true);
        }
    };

    const processAudio = async (base64Audio: string, mimeType: string) => {
        try {
            // Using unified endpoint to reduce latency (1 round trip instead of 2)
            const result = await processCopilotVoiceCommand(base64Audio, mimeType, { apartments, restaurants });
            
            setTranscript(result.transcript);
            
            if (result.command.type === 'UNKNOWN') {
                setFeedback({ type: 'error', message: "I didn't catch that. Try again?" });
            } else {
                onCommand(result.command);
                setFeedback({ type: 'success', message: "Command Executed" });
            }
        } catch (error) {
            console.error("Voice command failed:", error);
            setFeedback({ type: 'error', message: "Processing failed." });
        } finally {
            setIsProcessing(false);
            setTimeout(() => {
                setFeedback(null);
                setTranscript('');
            }, 4000);
        }
    };

    if (variant === 'inline') {
        return (
            <Card className="overflow-hidden relative border-0 shadow-lg rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 text-white">
                <CardContent className="p-0 relative z-10">
                    <div className="flex items-center justify-between p-6 h-24">
                        
                        {/* Status Area */}
                        <div className="flex-1 min-w-0 pr-6">
                            <div className="flex items-center gap-2 mb-1.5">
                                <Sparkles className="w-4 h-4 text-indigo-200" />
                                <h3 className="font-bold text-sm tracking-widest uppercase">Voice Command</h3>
                            </div>
                            
                            <p className="text-white/90 text-sm truncate font-medium">
                                {isProcessing ? (
                                    <span className="flex items-center gap-2"><Loader2 className="w-3 h-3 animate-spin" /> Processing...</span>
                                ) : feedback ? (
                                    <span className={feedback.type === 'error' ? "text-red-200" : "text-green-200"}>{feedback.message}</span>
                                ) : transcript ? (
                                    transcript
                                ) : (
                                    "Say 'Check calendar' or 'Draft message'..."
                                )}
                            </p>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-6">
                            <div className="text-right hidden sm:block">
                                <div className="text-[10px] font-bold uppercase tracking-widest text-indigo-200 mb-1">Status</div>
                                <div className="flex items-center justify-end gap-2">
                                    {isRecording ? <AudioVisualizer isActive={true} /> : <span className="text-sm font-bold">READY</span>}
                                </div>
                            </div>
                            
                            <Button
                                size="icon"
                                className={`h-14 w-14 rounded-xl shadow-lg transition-all duration-200 hover:scale-105 border-2 border-white/20 ${isRecording ? 'bg-white text-indigo-600' : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-md'}`}
                                onClick={isRecording ? stopRecording : startRecording}
                                disabled={isProcessing}
                            >
                                {isProcessing ? (
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                ) : isRecording ? (
                                    <Square className="w-5 h-5 fill-current" />
                                ) : (
                                    <Mic className="w-7 h-7" />
                                )}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // FAB Variant
    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 pointer-events-none">
            {(feedback || transcript) && (
                <div className={`pointer-events-auto max-w-[250px] p-4 rounded-xl shadow-xl backdrop-blur-md border border-white/20 text-white animate-slide-up flex flex-col gap-2 ${feedback?.type === 'error' ? 'bg-red-500/90' : 'bg-gray-900/90'}`}>
                    <div className="flex items-center gap-2 font-bold text-sm">
                        {feedback ? (
                            feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <AlertCircle className="w-4 h-4 text-white" />
                        ) : (
                            <Volume2 className="w-4 h-4 text-blue-400" />
                        )}
                        {feedback ? (feedback.type === 'success' ? "Done" : "Error") : "Heard"}
                    </div>
                    <p className="text-xs opacity-90 leading-relaxed">
                        {transcript || feedback?.message}
                    </p>
                </div>
            )}

            <div className="group relative pointer-events-auto">
                {isRecording && (
                    <div className="absolute inset-0 rounded-full bg-indigo-500 animate-ping opacity-75"></div>
                )}
                
                <Button
                    size="icon"
                    className={`relative h-16 w-16 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 border-4 border-white dark:border-gray-800 ${
                        isRecording 
                            ? 'bg-red-500 text-white hover:bg-red-600' 
                            : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                    onClick={isRecording ? stopRecording : startRecording}
                    disabled={isProcessing}
                >
                    {isProcessing ? (
                        <Loader2 className="w-8 h-8 animate-spin" />
                    ) : isRecording ? (
                        <Square className="w-6 h-6 fill-current" />
                    ) : (
                        <Mic className="w-8 h-8" />
                    )}
                </Button>
            </div>
        </div>
    );
};
