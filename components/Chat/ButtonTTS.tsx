import React, { useState } from 'react';
import {
    IconSpeakerphone,
    IconPlayerStop
} from '@tabler/icons-react';


interface UriParams {
    text: string;
    voice: string;
    noiseScale: number;
    noiseW: number;
    lengthScale: number;
    ssml: boolean;
    audioTarget: string;
}

// Function to convert parameters to URL search parameters
function paramsToSearch(params: UriParams): string {
    return Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key as keyof UriParams].toString())}`)
        .join('&');
}


interface ButtonTTSProps {
    text: string
}

const ButtonTTS: React.FC<ButtonTTSProps> = ({ text }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

    const params: UriParams = {
        text: text.replace(/\n\n/g, ". ").replace(/\n-/g, ". "),    // Simple fix to pause in-between bulletpoints
        voice: 'en_US/hifi-tts_low#6097',
        noiseScale: 0.5,
        noiseW: 0.5,
        lengthScale: 1,
        ssml: false,
        audioTarget: 'client'
    };

    const fetchAndPlayAudio = async () => {
        const baseUrl = 'http://0.0.0.0:59125/api/tts';
        const url = `${baseUrl}?${paramsToSearch(params)}`;

        const response = await fetch(url);
        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);
        const audio = new Audio(objectUrl);

        audio.addEventListener('ended', () => setIsPlaying(false));
        setAudio(audio);
        audio.play();
        setIsPlaying(true);
    };

    const stopAudio = () => {
        if (audio) {
            audio.pause();
            setIsPlaying(false);
        }
    };

    return (
        <button onClick={isPlaying ? stopAudio : fetchAndPlayAudio}>
            {isPlaying ? (
                <IconPlayerStop 
                    className="text-red-500 dark:text-red-400"
                    size={20} 
                />
                ) : (
                <IconSpeakerphone
                    className="invisible group-hover:visible focus:visible text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    size={20} 
                />
                )}
        </button>
    );
};

export default ButtonTTS;