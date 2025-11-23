// Timing Configuration
const CHAR_DELAY = 200;               // Base speed for characters (ms)
const PAUSE_BETWEEN_PHRASES = 500;  // Pause after sentence completes (ms)
const COMMA_PAUSE = 400;             // Extra pause when a comma is detected (ms)

// Global Delays
const INITIAL_DELAY = 10;          // Delay before the first phrase starts (ms)
const RESTART_DELAY = 4000;          // Delay before the entire loop restarts (ms)

// State
let contentData = null;
let currentPhraseIndex = 0;
let isPaused = false;

// DOM Elements Mapping
const domMap = {
    main: { r1: document.getElementById('main-r1'), r2: document.getElementById('main-r2'), flag: document.getElementById('flag-main') },
    en:   { r1: document.getElementById('en-r1'),   r2: document.getElementById('en-r2'),   flag: document.getElementById('flag-en') },
    zh:   { r1: document.getElementById('zh-r1'),   r2: document.getElementById('zh-r2'),   flag: document.getElementById('flag-zh') },
    ru:   { r1: document.getElementById('ru-r1'),   r2: document.getElementById('ru-r2'),   flag: document.getElementById('flag-ru') }
};

// Initialization (Updated)
async function init() {
    try {
        const response = await fetch('content.json');
        contentData = await response.json();
        
        // Set static flags for translation sections
        domMap.en.flag.src = contentData.flags['en'];
        domMap.ru.flag.src = contentData.flags['ru'];
        domMap.zh.flag.src = contentData.flags['zh-cn'];
        
        // [FIX] Set the main flag to Spanish (es) immediately for the INITIAL_DELAY period
        domMap.main.flag.src = contentData.flags['es'];

        // Wait for the initial delay before starting
        await wait(INITIAL_DELAY);
        
        playNextPhrase();
    } catch (error) {
        console.error("Error loading content.json:", error);
        alert("Error loading content.json. Please ensure the file exists.");
    }
}

// Full Screen Toggle (same as before)
document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'f') {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }
});

// Main Loop (same as before)
async function playNextPhrase() {
    if (currentPhraseIndex >= contentData.phrases.length) {
        // Wait for the restart delay before looping back to the start
        await wait(RESTART_DELAY);
        currentPhraseIndex = 0; // Loop back to start
    }

    const phrase = contentData.phrases[currentPhraseIndex];
    
    // 1. Setup Flags (This will update the flag to the phrase's language, overriding the default 'es' set in init)
    updateMainFlag(phrase.language);

    // 2. Clear all rows
    clearRows();

    // 3. Start typing all languages simultaneously
    const typePromises = [
        typeWriter(domMap.main, phrase.main, phrase.language),
        typeWriter(domMap.en, phrase.en, 'en'),
        typeWriter(domMap.zh, phrase['zh-cn'], 'zh-cn'),
        typeWriter(domMap.ru, phrase.ru, 'ru')
    ];

    await Promise.all(typePromises);

    // 4. Wait after completion
    await wait(PAUSE_BETWEEN_PHRASES);

    // 5. Next
    currentPhraseIndex++;
    playNextPhrase();
}

function updateMainFlag(langCode) {
    let flagUrl = contentData.flags[langCode];
    if (!flagUrl && langCode.startsWith('zh')) flagUrl = contentData.flags['zh-cn'];
    domMap.main.flag.src = flagUrl || '';
}

function clearRows() {
    Object.values(domMap).forEach(section => {
        section.r1.textContent = '';
        section.r2.textContent = '';
    });
}

// The Core Typing Logic (same as before)
function typeWriter(sectionElements, text, language) {
    return new Promise(async (resolve) => {
        const isChinese = language.startsWith('zh');
        const tokens = isChinese ? text.split('') : text.split(' ');
        const delay = isChinese ? CHAR_DELAY : CHAR_DELAY * 2;

        for (let i = 0; i < tokens.length; i++) {
            let token = tokens[i];
            
            let currentText = sectionElements.r2.textContent;
            
            let spacer = (!isChinese && currentText.length > 0) ? " " : "";
            let textToTest = currentText + spacer + token;

            sectionElements.r2.textContent = textToTest;

            const limit = window.innerWidth * 0.6667;
            
            if (sectionElements.r2.offsetWidth > limit) {
                // Move OLD Row 2 text to Row 1
                sectionElements.r1.textContent = currentText;
                // Start Row 2 fresh with the NEW token
                sectionElements.r2.textContent = token;
            }

            // Standard wait for the character/word
            await wait(delay);

            // Check for comma and add extra pause
            if (token.includes(',') || token.includes('，')) {
                await wait(COMMA_PAUSE);
            }
        }
        resolve();
    });
}

// Helper (same as before)
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Start (same as before)
window.onload = init;