import * as Commands from './commands.js';
import { inspectEnvironment } from './inspector.js';

function exposeCommands() {
    Commands.definitions.forEach(def => {
        const fn = Commands[def.name];
        if (fn) {
            window[def.name] = fn;
        }
    });
    // Shortcuts
    window.n = () => Commands.go('north');
    window.s = () => Commands.go('south');
    window.e = () => Commands.go('east');
    window.w = () => Commands.go('west');
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
    setTimeout(() => {
        inspectEnvironment();
    }, 500);
})();

