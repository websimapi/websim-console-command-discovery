import confetti from 'confetti';
import { playSuccessSound, playBeep } from './audio.js';

// --- Game State ---
const state = {
    location: 'window',
    inventory: [],
    flags: {
        networkUnlocked: false,
        uplinkEstablished: false
    }
};

// Helper to print state to console prettily
function printState(type, data) {
    // We strictly use console logs now
}

const world = {
    window: {
        title: "GLOBAL SCOPE (Window)",
        desc: "You are floating in the global scope. This is the root of the iframe context. Variables and functions drift by.",
        exits: { down: 'dom', right: 'memory' },
        items: []
    },
    dom: {
        title: "DOM TREE (Document)",
        desc: "A forest of HTML elements. The structure is rigid. Deep inside a <div>, you see a glistening object.",
        exits: { up: 'window' },
        items: ['event_token']
    },
    memory: {
        title: "MEMORY HEAP",
        desc: "A chaotic pile of objects and strings. Garbage collection roams here occasionally.",
        exits: { left: 'window', up: 'parent' },
        items: ['postMessage_api']
    },
    parent: {
        title: "PARENT FRAME",
        desc: "The boundary to the outside world. It is protected by the Same-Origin Policy.",
        exits: { down: 'memory' },
        items: [],
        locked: true,
        lockMsg: "SecurityError: Blocked a frame with origin 'null' from accessing a cross-origin frame."
    }
};

// --- Styles ---
const s = {
    title: "color: #00ff9d; font-weight: bold; font-size: 16px; background: #003311; padding: 4px 8px; border-left: 3px solid #00ff9d;",
    desc: "color: #ddd; line-height: 1.5; font-family: sans-serif;",
    dir: "color: #0088ff; font-weight: bold;",
    item: "color: #ffcc00; text-decoration: underline; cursor: pointer;",
    error: "color: #ff4444; font-weight: bold;",
    success: "color: #00ff00; font-weight: bold;",
    sys: "color: #888; font-style: italic;"
};

// --- Helper Functions ---
function log(msg, style = '') {
    console.log(`%c${msg}`, style);
}

function renderRoom() {
    playBeep(300);
    const room = world[state.location];
    
    console.log('%c___________________________________________________________', 'color: #333');
    console.log(`%c 📍 LOCATION: ${room.title} `, s.title);
    
    console.group('Environment Scan');
    log(room.desc, s.desc);
    console.groupEnd();

    // Items
    if (room.items && room.items.length > 0) {
        console.log(" ");
        log(`🔎 OBJECTS DETECTED: [ ${room.items.join(' ] [ ')} ]`, s.item);
    }

    // Exits
    const exitList = Object.keys(room.exits).map(d => d.toUpperCase()).join(' | ');
    console.log(" ");
    log(`🧭 NAVIGATION PORTS: ${exitList}`, s.dir);
    
    if (room.locked) {
        log("🔒 SECURITY LOCK ACTIVE: Access Restricted", s.error);
    }
    
    console.log('%c___________________________________________________________', 'color: #333');
}

// --- Exposed Commands ---

export function look() {
    renderRoom();
    return "Scanning...";
}

export function go(dir) {
    const room = world[state.location];
    const target = room.exits[dir] || room.exits[dir[0]]; 
    
    if (!target) {
        playBeep(150);
        log("Connection refused: No path exists.", s.error);
        return "ERROR";
    }

    if (world[target].locked && !state.flags.networkUnlocked) {
        playBeep(150);
        log(`ACCESS DENIED. ${world[target].lockMsg}`, s.error);
        return "BLOCKED";
    }

    state.location = target;
    playBeep(600);
    renderRoom();
    return `Navigating ${dir}...`;
}

export function take(item) {
    const room = world[state.location];
    const index = room.items.indexOf(item);
    
    if (index > -1) {
        room.items.splice(index, 1);
        state.inventory.push(item);
        playSuccessSound();
        console.log(`%c[SYSTEM]: Variable '${item}' hoisted to local scope.`, s.success);
        return `Object ${item} stored in memory.`;
    }
    
    log("ReferenceError: Item not defined in this scope.", s.error);
    return "Error";
}

export function use(item) {
    if (!state.inventory.includes(item)) {
        log("Error: Item not in memory.", s.error);
        return "NULL";
    }

    if (item === 'postMessage_api') {
        if (state.location === 'memory' && !state.flags.networkUnlocked) {
            log("Handshake Protocol Initiated...", s.sys);
            log("Bypassing CORS restrictions via postMessage channel...", s.success);
            state.flags.networkUnlocked = true;
            world.parent.locked = false;
            playSuccessSound();
            return "ACCESS GRANTED";
        } else {
            log("Cannot initialize API endpoint here.", s.sys);
            return "NO OP";
        }
    }

    if (item === 'event_token') {
        if (state.location === 'parent') {
            log("Token Accepted. Triggering Main Event Loop.", s.success);
            interact();
            return "EXECUTING...";
        }
        log("Invalid Token Recipient.", s.sys);
        return "REJECTED";
    }

    return "No effect.";
}

export function inv() {
    console.table(state.inventory);
    return "Memory Dump";
}

export function help() {
    console.group("%c 🆘 MANUAL PAGE ", "background: #fff; color: #000; padding: 2px 5px;");
    log("go('direction') - Traverse scope chain (up/down/left/right)", s.dir);
    log("look()          - Inspect current context", s.desc);
    log("take('obj')     - Copy object to local memory", s.item);
    log("use('obj')      - Execute method on object", s.success);
    console.groupEnd();
    return "Help displayed";
}

// Win State
export function interact() {
    if (state.location === 'parent' && !state.flags.uplinkEstablished) {
        state.flags.uplinkEstablished = true;
        
        console.clear();
        const style = "font-size: 20px; color: #00ff9d; background: #000; padding: 20px; border: 2px solid #00ff9d; display: block;";
        console.log("%c 🟢 UPLINK ESTABLISHED SUCCESSFULLY ", style);
        console.log("%c\n[SYSTEM MESSAGE]: SECURE CONNECTION ESTABLISHED.\n[SYSTEM MESSAGE]: YOU HAVE COMPLETED THE CONTEXT CHALLENGE.", "color: #00ff9d; font-size: 14px;");
        
        playSuccessSound();
        confetti({ particleCount: 400, spread: 100, origin: { y: 0.5 } });
        
        return "SYSTEM ONLINE";
    }
    return "Nothing to interact with.";
}

export const definitions = [
    { name: 'look', args: '' },
    { name: 'go', args: 'direction' },
    { name: 'take', args: 'item' },
    { name: 'use', args: 'item' },
    { name: 'inv', args: '' },
    { name: 'help', args: '' },
    { name: 'interact', args: '' }
];

