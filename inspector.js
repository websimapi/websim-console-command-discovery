import { look } from './commands.js';

export function inspectEnvironment() {
    console.clear();
    
    const titleStyle = "font-size: 30px; font-weight: bold; color: #00ff9d; background: #000; padding: 10px; border: 2px solid #00ff9d;";
    const subStyle = "color: #888; font-style: italic;";
    
    console.log(`%c SYSTEM BOOT SEQUENCE INITIATED... `, titleStyle);
    console.log(`%cLoading core modules... OK`, subStyle);
    console.log(`%cInitializing physics engine... OK`, subStyle);
    console.log(`%cMounting file system... OK`, subStyle);
    
    console.log("\n");
    console.log("%c⚠️  TERMINAL UPLINK ESTABLISHED", "color: orange; font-weight: bold;");
    console.log("Type %chelp()%c to see available commands.", "color: cyan", "color: inherit");
    console.log("\n");

    // Auto-look to start the game visually in the console
    look();
}

