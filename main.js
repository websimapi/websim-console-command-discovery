import * as Commands from './commands.js';
import { inspectEnvironment } from './inspector.js';

// No UI Logic needed - strictly console

function exposeCommands() {
    Commands.definitions.forEach(def => {
        const fn = Commands[def.name];
        if (fn) {
            window[def.name] = fn;
        }
    });
    // Shortcuts
    window.up = () => Commands.go('up');
    window.down = () => Commands.go('down');
    window.left = () => Commands.go('left');
    window.right = () => Commands.go('right');
    window.i = () => Commands.inv();
}

function setupPostMessageListener() {
    window.addEventListener('message', (event) => {
        const data = event.data;
        if (!data || typeof data.command !== 'string') return;
        const fn = Commands[data.command];
        if (fn) {
            const args = Array.isArray(data.args) ? data.args : [data.args].filter(a => a !== undefined);
            fn(...args);
        }
    });
}

(function init() {
    exposeCommands();
    setupPostMessageListener();
    
    // Boot up
    console.log("Initializing Virtual Machine...");
    setTimeout(() => {
        inspectEnvironment();
    }, 800);
})();

