// This module analyzes the environment and logs verbose info
export function inspectEnvironment(exposedFunctions) {
    const info = {
        location: window.location.href,
        userAgent: navigator.userAgent,
        isIframe: window.self !== window.top,
        exposed: Object.keys(exposedFunctions)
    };

    const headerStyle = "background: #222; color: #bada55; font-size: 14px; padding: 4px; border-radius: 4px;";
    const codeStyle = "color: #00ff9d; font-family: monospace; font-size: 12px; background: #111; padding: 2px 5px; border-radius: 3px;";
    const warnStyle = "background: #8B0000; color: #fff; padding: 4px; border-radius: 4px; font-weight: bold;";
    const groupStyle = "background: #000; color: #fff; font-size: 20px; padding: 10px; border-radius: 5px;";

    console.group('%c 🕵️ COMMAND DISCOVERY TOOL ', groupStyle);
    
    console.log(`%c 📍 Page Context `, headerStyle);
    console.table({
        'Context': info.isIframe ? 'IFRAME (Inside Parent)' : 'TOP (No Parent)',
        'URL': new URL(info.location).pathname,
    });

    console.log(`%c 🛠 Available Commands `, headerStyle);
    console.log(`%cThe following functions are exposed on the 'window' object:`, "color: #ccc");
    
    exposedFunctions.forEach(fn => {
        console.log(`%c➤ window.${fn.name}(${fn.args}) %c// ${fn.description}`, codeStyle, "color: #aaa; font-style: italic;");
    });

    console.log(`%c 🚀 HOW TO EXECUTE COMMANDS `, headerStyle);
    
    if (info.isIframe) {
        console.log(`%c⚠ IFRAME DETECTED (Cross-Origin Restrictions Apply)`, warnStyle);
        console.log(`%cIf you see "TypeError: window.say is not a function", you are executing in the PARENT context.`, "color: #ffaaaa");
        console.log(`%cIf you see "SecurityError", you are trying to access the iframe unsafely.`, "color: #ffaaaa");
        
        console.log(`\n%c✅ METHOD 1: Switch Context (Recommended)`, "color: #bada55; font-weight: bold;");
        console.log(`1. In the Console top-left, click the dropdown (usually says "top").`);
        console.log(`2. Select the frame for this page.`);
        console.log(`3. Run: %csay("I am inside!")`, codeStyle);

        console.log(`\n%c✅ METHOD 2: PostMessage (Safe from Top Level)`, "color: #bada55; font-weight: bold;");
        console.log(`Copy/paste this block to run commands from the "top" context:`);
        
        const pmSnippet = `document.querySelector('iframe').contentWindow.postMessage(\n  { command: 'say', args: ['Hello via PostMessage'] },\n  '*'\n);`;
        console.log(`%c${pmSnippet}`, codeStyle);
    } else {
        console.log(`%cYou are on the top level. Just type commands directly!`, "color: #ccc");
        console.log(`%c   say("Hello World")`, codeStyle);
    }

    console.groupEnd();

    // Update the on-page snippet preview
    const snippetEl = document.getElementById('snippet-preview');
    if (snippetEl) {
        if (info.isIframe) {
             snippetEl.innerHTML = `<span style="color:#888">// METHOD 1: Switch DevTools context to this iframe, then run:</span>\n<span style="color:#a6e22e">say</span>(<span style="color:#e6db74">"Hello"</span>);\n\n<span style="color:#888">// METHOD 2: Run this from the TOP console context:</span>\ndocument.<span style="color:#66d9ef">querySelector</span>(<span style="color:#e6db74">'iframe'</span>).contentWindow.<span style="color:#66d9ef">postMessage</span>(\n  { command: <span style="color:#e6db74">'say'</span>, args: [<span style="color:#e6db74">'Hello via Message'</span>] }, \n  <span style="color:#e6db74">'*'</span>\n);`;
        } else {
             snippetEl.textContent = `say("Hello")`;
        }
    }
}

