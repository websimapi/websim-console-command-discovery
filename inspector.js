import { look } from './commands.js';

export function inspectEnvironment() {
    console.clear();
    
    const titleStyle = "font-size: 24px; font-weight: bold; color: #00ff9d; background: #050505; padding: 10px; border-bottom: 2px solid #00ff9d; display: block; width: 100%;";
    const infoStyle = "color: #0088ff; font-size: 14px; margin-top: 5px;";
    const warnStyle = "color: #ffaa00; font-style: italic;";
    
    console.log(`%c 🕵️ IFRAME CONTEXT INSPECTOR v2.0 `, titleStyle);
    console.log(`%cCurrent Scope: Window (iframe)`, infoStyle);
    console.log(`%cParent Access: Restricted (Cross-Origin)`, warnStyle);
    
    console.log("\n");
    console.log("%c⚠️  CONSOLE UPLINK REQUIRED", "color: orange; font-weight: bold; font-size: 16px;");
    
    console.group("HOW TO CONNECT:");
    console.log("1. Focus this frame. (If in Chrome DevTools, click the 'top' dropdown above the console and select this frame).");
    console.log("2. Or use: cd(document.querySelector('iframe')) if available.");
    console.log("3. Once connected, type %chelp()%c to begin.", "color: cyan; font-weight: bold;", "color: inherit;");
    console.groupEnd();

    console.log("\n");
    
    // Auto-look to start game
    look();
}

