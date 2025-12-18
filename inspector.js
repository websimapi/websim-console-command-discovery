// This module analyzes the environment and logs verbose info
export function inspectEnvironment(exposedFunctions) {
    const info = {
        location: window.location.href,
        userAgent: navigator.userAgent,
        isIframe: window.self !== window.top,
        exposed: Object.keys(exposedFunctions)
    };

    const headerStyle = "background: #222; color: #bada55; font-size: 14px; padding: 4px; border-radius: 4px;";
    const codeStyle = "color: #00ff9d; font-family: monospace; font-size: 12px;";
    const warnStyle = "background: #552222; color: #ffaaaa; padding: 2px;";

    console.group('%c 🕵️ COMMAND DISCOVERY TOOL ', 'background: #000; color: #fff; font-size: 20px; padding: 10px; border-radius: 5px;');
    
    console.log(`%cCurrent Page Info:`, headerStyle);
    console.table({
        'URL': info.location,
        'In Iframe?': info.isIframe
    });

    console.log(`%cAvailable Commands (Attached to window):`, headerStyle);
    
    exposedFunctions.forEach(fn => {
        console.log(`%c➤ window.${fn.name}(${fn.args}) %c// ${fn.description}`, codeStyle, "color: #888;");
    });

    console.log(`%c\nHOW TO EXECUTE COMMANDS:`, headerStyle);
    
    if (info.isIframe) {
        console.log(`%cSince this page is inside an iframe, you have two options:`, "color: #ccc");
        console.log(`1. Use the Context Selector in DevTools (top left of Console) to switch from "top" to this frame.`);
        console.log(`2. Target the iframe from the parent console (if Same-Origin policy allows):`);
        
        // Attempt to determine likely iframe selector
        const likelySnippet = `document.querySelector('iframe').contentWindow.say("Hello World")`;
        console.log(`%c   ${likelySnippet}`, codeStyle);
    } else {
        console.log(`%cYou are on the top level. Just type commands directly!`, "color: #ccc");
        console.log(`%c   say("Hello World")`, codeStyle);
    }

    console.groupEnd();

    // Update the on-page snippet preview
    const snippetEl = document.getElementById('snippet-preview');
    if (snippetEl) {
        if (info.isIframe) {
             snippetEl.textContent = `// Run from parent console:\ndocument.querySelector('iframe').contentWindow.say("Hello")\n\n// Or switch console context to this frame and run:\nsay("Hello")`;
        } else {
             snippetEl.textContent = `say("Hello")`;
        }
    }
}

