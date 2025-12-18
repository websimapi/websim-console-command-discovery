import * as Commands from './commands.js';
import { inspectEnvironment } from './inspector.js';

// --- UI Logic ---
const ui = {
    status: document.getElementById('uplink-status'),
    log: document.getElementById('log-feed'),
    cells: {
        window: document.getElementById('loc-window'),
        dom: document.getElementById('loc-dom'),
        memory: document.getElementById('loc-memory'),
        parent: document.getElementById('loc-parent')
    },
    memStat: document.getElementById('mem-stat'),
    latStat: document.getElementById('lat-stat')
};

function handleGameUpdate(e) {
    const { action, data, state } = e.detail;

    // Simulate system metrics
    ui.memStat.innerText = Math.floor(Math.random() * 50 + 20) + " MB";
    ui.latStat.innerText = Math.floor(Math.random() * 10 + 1);

    if (action === 'log') {
        const line = document.createElement('div');
        line.innerText = `> ${data}`;
        ui.log.appendChild(line);
        ui.log.scrollTop = ui.log.scrollHeight;
    }

    if (action === 'location') {
        // Update Grid Visuals
        Object.values(ui.cells).forEach(el => el.classList.remove('active'));
        const activeCell = ui.cells[data];
        if (activeCell) activeCell.classList.add('active');
        
        // Update Locks
        if (!state.flags.networkUnlocked) {
            ui.cells.parent.classList.add('locked');
            ui.cells.parent.innerHTML = "PARENT FRAME<br>🔒";
        } else {
            ui.cells.parent.classList.remove('locked');
            ui.cells.parent.innerHTML = "PARENT FRAME<br>🔓";
        }
    }

    if (action === 'win') {
        ui.status.innerText = "STATUS: ONLINE";
        ui.status.classList.add('online');
        ui.log.innerHTML += "\n[SYSTEM MESSAGE]: SECURE CONNECTION ESTABLISHED.\n[SYSTEM MESSAGE]: MONITORING ACTIVE.";
    }
}

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
    // Listen for game events
    window.addEventListener('hub-update', handleGameUpdate);

    exposeCommands();
    setupPostMessageListener();
    
    // Boot up
    setTimeout(() => {
        inspectEnvironment();
    }, 500);

    // Initial flicker
    setInterval(() => {
        if (Math.random() > 0.9) {
            ui.latStat.innerText = Math.floor(Math.random() * 100);
        }
    }, 1000);
})();

