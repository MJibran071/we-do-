import React from 'react';
import { PlayCircle, PauseCircle } from 'lucide-react';

interface AudioWaveformProps {
    isPlaying: boolean;
    onPlayPause: () => void;
    theme: any;
}

export const AudioWaveform: React.FC<AudioWaveformProps> = ({ isPlaying, onPlayPause, theme }) => {
    return (
        <div className={`flex items-center gap-3 ${theme.lightBg} dark:bg-gray-800 p-2.5 rounded-xl min-w-[200px]`}>
            <button onClick={onPlayPause} className={`shrink-0 ${theme.text} dark:${theme.darkText} hover:scale-110 transition-transform`}>
                {isPlaying ? <PauseCircle className="w-8 h-8" /> : <PlayCircle className="w-8 h-8" />}
            </button>
            <div className="flex items-center gap-1 h-8 flex-1">
                {[...Array(15)].map((_, i) => (
                    <div
                        key={i}
                        className={`w-1 ${theme.bg.replace('bg-', 'bg-').replace('600', '400')} dark:${theme.bg.replace('bg-', 'bg-').replace('600', '500')} rounded-full transition-all duration-300 ${isPlaying ? 'animate-music-bar' : 'h-3'}`}
                        style={{ animationDelay: `${i * 0.1}s`, height: isPlaying ? '100%' : `${Math.random() * 16 + 4}px` }}
                    />
                ))}
            </div>
            <span className={`text-[10px] font-mono ${theme.text} dark:${theme.darkText} opacity-70`}>0:12</span>
        </div>
    );
};
