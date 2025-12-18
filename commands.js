import confetti from 'confetti';
import { playSuccessSound, playBeep } from './audio.js';

// --- Game State ---
const state = {
    location: 'cryo',
    inventory: [],
    flags: {
        power: false,
        doorUnlocked: false
    }
};

const world = {
    cryo: {
        title: "CRYO BAY 7",
        desc: "The air is frigid. Rows of empty stasis pods line the walls. One pod is blinking red.",
        exits: { north: 'hallway' },
        items: ['flask']
    },
    hallway: {
        title: "MAIN CORRIDOR",
        desc: "A long metal corridor. Emergency lights flicker. Cables hang from the ceiling.",
        exits: { south: 'cryo', east: 'storage', west: 'bridge', north: 'engine' },
        items: []
    },
    storage: {
        title: "STORAGE CLOSET",
        desc: "Cramped and dusty. Shelves are mostly empty.",
        exits: { west: 'hallway' },
        items: ['flashlight']
    },
    bridge: {
        title: "COMMAND BRIDGE",
        desc: "The nerve center of the ship. It is pitch black in here.",
        exits: { east: 'hallway' },
        items: ['keycard'],
        dark: true
    },
    engine: {
        title: "ENGINE ROOM",
        desc: "The massive reactor core sits silent. There is a control panel here.",
        exits: { south: 'hallway' },
        items: [],
        locked: true
    }
};

// --- Styles ---
const s = {
    title: "color: #ff00ff; font-weight: bold; font-size: 14px; background: #220022; padding: 2px 5px;",
    desc: "color: #ccc; line-height: 1.5;",
    dir: "color: #00ffff; font-weight: bold;",
    item: "color: #ffff00; text-decoration: underline;",
    error: "color: #ff4444;",
    success: "color: #00ff00;",
    sys: "color: #666; font-style: italic;"
};

// --- Helper Functions ---
function log(msg, style = '') {
    console.log(`%c${msg}`, style);
}

function renderRoom() {
    playBeep(300);
    const room = world[state.location];
    
    console.group(`%c 📍 ${room.title} `, s.title);
    
    if (room.dark && !state.inventory.includes('flashlight')) {
        log("It is too dark to see anything here.", s.desc);
        log("exits: " + Object.keys(room.exits).join(', '), s.dir);
        console.groupEnd();
        return;
    }

    log(room.desc, s.desc);

    // Items
    if (room.items && room.items.length > 0) {
        log(`You see: ${room.items.join(', ')}`, s.item);
    }

    // Exits
    const exitList = Object.keys(room.exits).map(d => d.toUpperCase()).join(' | ');
    log(`EXITS: [ ${exitList} ]`, s.dir);
    
    console.groupEnd();
}

// --- Exposed Commands ---

export function look() {
    renderRoom();
    return "👀";
}

export function go(dir) {
    const room = world[state.location];
    const target = room.exits[dir] || room.exits[dir[0]]; // allow 'n' for 'north'
    
    if (!target) {
        playBeep(150);
        log("You can't go that way.", s.error);
        return "🚫";
    }

    if (world[target].locked && !state.flags.doorUnlocked) {
        playBeep(150);
        log("The door is LOCKED. You need authorization.", s.error);
        return "🔒";
    }

    state.location = target;
    playBeep(600);
    renderRoom();
    return `🚶 Heading ${dir}...`;
}

export function take(item) {
    const room = world[state.location];
    if (room.dark && !state.inventory.includes('flashlight')) {
        log("It's too dark to find anything.", s.error);
        return "🌑";
    }

    const index = room.items.indexOf(item);
    if (index > -1) {
        room.items.splice(index, 1);
        state.inventory.push(item);
        playSuccessSound();
        log(`Taken: ${item}`, s.success);
        return `✊ You took the ${item}`;
    }
    
    log("You don't see that here.", s.error);
    return "❓";
}

export function use(item) {
    if (!state.inventory.includes(item)) {
        log("You don't have that.", s.error);
        return "❌";
    }

    if (item === 'flashlight') {
        log("You click the flashlight on. It cuts through the darkness.", s.success);
        renderRoom(); // Re-render to show hidden items
        return "🔦";
    }

    if (item === 'keycard') {
        if (state.location === 'hallway') {
            log("ACCESS GRANTED. The Engine Room door slides open.", s.success);
            state.flags.doorUnlocked = true;
            world.engine.locked = false;
            playSuccessSound();
            return "💳";
        } else {
            log("You can't use that here.", s.sys);
            return "🤷";
        }
    }

    if (item === 'flask') {
        log("You take a sip. Refreshing space water.", s.desc);
        return "💧";
    }

    return "Nothing happened.";
}

export function inv() {
    console.table(state.inventory);
    return "🎒 Inventory Check";
}

export function help() {
    console.group("%c 🆘 HELP ", "background: #fff; color: #000; padding: 2px 5px;");
    log("go('north')  - Move around", s.dir);
    log("look()       - Inspect area", s.desc);
    log("take('item') - Pick up item", s.item);
    log("use('item')  - Use item", s.success);
    log("inv()        - Check pockets", s.sys);
    console.groupEnd();
    return "Help displayed";
}

// Special interaction for Engine Room
export function interact() {
    if (state.location === 'engine') {
        log("You engage the restart sequence...", s.success);
        setTimeout(() => {
            log("Reactors Stabilized.", s.success);
            log("Systems Online.", s.success);
            log("MISSION COMPLETE", "font-size: 40px; color: #00ff00; font-weight: bold;");
            playSuccessSound();
            confetti({ particleCount: 200, spread: 100 });
        }, 1000);
        return "🚀 STARTING ENGINE";
    }
    return "Nothing to interact with here.";
}

// Export definitions for auto-mapping to window
export const definitions = [
    { name: 'look', args: '' },
    { name: 'go', args: 'direction' },
    { name: 'take', args: 'item' },
    { name: 'use', args: 'item' },
    { name: 'inv', args: '' },
    { name: 'help', args: '' },
    { name: 'interact', args: '' }
];

