import { look } from './commands.js';

export function inspectEnvironment() {
    console.clear();
    
    const titleStyle = "font-size: 20px; font-weight: bold; color: #00ff9d; background: #111; padding: 10px; border-left: 5px solid #00ff9d; display: block; margin-bottom: 10px;";
    const subStyle = "color: #888; font-size: 12px;";
    
    console.log(`%c 🕵️ COMMAND DISCOVERY TOOL v3.1 `, titleStyle);
    
    console.groupCollapsed("%c ▶ SYSTEM DIAGNOSTICS (Click to expand)", "color: #888;");
    console.log("User Agent:", navigator.userAgent);
    console.log("Location:", window.location.href);
    console.log("Parent:", window.parent !== window ? "Detected (Restricted)" : "None");
    console.groupEnd();

    console.log("%cAvailable Commands (Attached to window):", "color: #fff; font-weight: bold; font-size: 14px; margin-top: 10px;");
    console.log("%c ➤ window.look()    %c// Inspect current surroundings", "color: cyan; font-weight: bold;", "color: #777;");
    console.log("%c ➤ window.go(dir)   %c// Move (north, south, east, west)", "color: cyan; font-weight: bold;", "color: #777;");
    console.log("%c ➤ window.take(obj) %c// Pick up item", "color: cyan; font-weight: bold;", "color: #777;");
    console.log("%c ➤ window.use(obj)  %c// Interact with item", "color: cyan; font-weight: bold;", "color: #777;");
    console.log("%c ➤ window.inv()     %c// Check inventory", "color: cyan; font-weight: bold;", "color: #777;");
    console.log(" ");
    
    console.group("%c ⚠️ HOW TO EXECUTE COMMANDS ", "color: #ffcc00; font-size: 14px; background: #332200; padding: 4px; width: 100%;");
    console.log("Since this page is running inside an iframe, you have two options:");
    console.log(" ");
    console.log("%cOPTION 1: CONTEXT SWITCH (Recommended)", "font-weight: bold; color: #fff;");
    console.log("1. Look at the top-left of this Console panel.");
    console.log("2. Find the dropdown that currently says 'top'.");
    console.log("3. Click it and select the frame corresponding to this game.");
    console.log("4. Type 'look()' and hit Enter.");
    console.log(" ");
    console.log("%cOPTION 2: PARENT TARGETING", "font-weight: bold; color: #fff;");
    console.log("If you cannot switch context, target the frame from the main console:");
    console.log("%c document.querySelector('iframe').contentWindow.look()", "background: #222; color: #fff; padding: 2px; border-radius: 4px;");
    console.groupEnd();

    console.log("\n%c> System ready. Waiting for input...", "color: #00ff9d; animation: blink 1s infinite;");
    
    // We don't auto-look immediately so they see the instructions first
}

