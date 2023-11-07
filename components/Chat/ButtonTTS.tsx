import React, { useState } from 'react';
import {
    IconSpeakerphone,
    IconPlayerStop
} from '@tabler/icons-react';
import { fetchAudioFromOpenAI } from '../../services/useTtsService';

interface ButtonTTSProps {
    text: string;
    apiKey: string;
}

const ButtonTTS: React.FC<ButtonTTSProps> = ({ text }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

    const fetchAndPlayAudioHandler = async () => {
        const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

        // Check if apiKey is undefined or an empty string
        if (typeof apiKey === 'undefined' || apiKey === "") {
            console.error('OPENAI_API_KEY is not set or empty in the environment variables.');
            return; // Exit the function if apiKey is not valid
        }
        
        fetchAudioFromOpenAI(text, apiKey as string)
            .then(audio => {
                if (audio) {
                    audio!.addEventListener('ended', () => setIsPlaying(false));
                    setAudio(audio);
                    audio!.play();
                    setIsPlaying(true);                }
            })
            .catch(error => console.error('Failed to play audio:', error));

    };

    const stopAudio = () => {
        if (audio) {
            audio.pause();
            setIsPlaying(false);
        }
    };

    return (
        <button onClick={isPlaying ? stopAudio : fetchAndPlayAudioHandler}>
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