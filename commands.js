import confetti from 'confetti';
import { playSuccessSound } from './audio.js';

// Helper to update UI
function updateStatus(msg) {
    const el = document.getElementById('last-command');
    if (el) {
        el.innerText = `> ${msg}`;
        el.parentElement.classList.remove('active');
        // Force reflow
        void el.parentElement.offsetWidth; 
        el.parentElement.classList.add('active');
    }
}

// Command: say
export function say(text) {
    console.log(`%c[Command Received] say("${text}")`, 'color: #00ff9d; font-weight: bold;');
    updateStatus(`say("${text}")`);
    
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
    } else {
        console.warn('Text-to-speech not supported in this browser.');
    }
    return `Speaking: "${text}"`;
}

// Command: setBg
export function setBg(color) {
    console.log(`%c[Command Received] setBg("${color}")`, 'color: #00ff9d; font-weight: bold;');
    updateStatus(`setBg("${color}")`);
    
    document.body.style.backgroundColor = color;
    return `Background changed to ${color}`;
}

// Command: party
export function party() {
    console.log(`%c[Command Received] party()`, 'color: #00ff9d; font-weight: bold;');
    updateStatus(`party()`);
    playSuccessSound();
    
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });
    return "Let's party!";
}

// Command: reset
export function reset() {
    console.log(`%c[Command Received] reset()`, 'color: #00ff9d; font-weight: bold;');
    updateStatus(`reset()`);
    
    document.body.style.backgroundColor = '';
    return "State reset.";
}

// Export a list of definitions for the inspector
export const definitions = [
    { name: 'say', args: 'text', description: 'Speak text using TTS' },
    { name: 'setBg', args: 'color', description: 'Change background CSS color' },
    { name: 'party', args: '', description: 'Trigger confetti and sound' },
    { name: 'reset', args: '', description: 'Reset page styles' }
];

