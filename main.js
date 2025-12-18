import * as Commands from './commands.js';
import { inspectEnvironment } from './inspector.js';

// Expose functions to the global window object
function exposeCommands() {
    Commands.definitions.forEach(def => {
        // Find the function in the module exports
        const fn = Commands[def.name];
        if (fn) {
            window[def.name] = fn;
        }
    });
}

// Build the UI list
function buildUI() {
    const list = document.getElementById('function-list');
    if (!list) return;

    Commands.definitions.forEach(def => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>
                <code>${def.name}(<span style="color:#aaa">${def.args}</span>)</code>
            </span>
            <span class="arg-type">${def.description}</span>
        `;
        // Add click listener to demo it
        li.style.cursor = 'pointer';
        li.title = 'Click to test this command';
        li.addEventListener('click', () => {
             // Demo execution
             if (def.name === 'say') Commands.say('Hello from the interface');
             if (def.name === 'setBg') Commands.setBg(getRandomColor());
             if (def.name === 'party') Commands.party();
             if (def.name === 'reset') Commands.reset();
        });
        list.appendChild(li);
    });
}

function getRandomColor() {
    const colors = ['#2d4030', '#2d2d40', '#402d2d', '#403d2d', '#1a1a1a'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Initialization
(function init() {
    exposeCommands();
    buildUI();
    
    // Slight delay to ensure console is ready/visible if user opens it
    setTimeout(() => {
        inspectEnvironment(Commands.definitions);
    }, 500);

    // Add a global greeting
    console.log("Welcome! Check the object below for all exposed methods:");
    console.dir(window);
})();

