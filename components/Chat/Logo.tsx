import styles from './Logo.module.css';
import { Poppins } from 'next/font/google'

const poppins = Poppins({weight:"700", subsets:["latin"]})

export const Logo = () => {
    return (
        <div className={styles.heading}>
            <div className={poppins.className}>
                Chatbot NG
            </div>
        </div>
    )    
}