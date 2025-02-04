// Initialize scenes
let chatScene, tableScene;

document.addEventListener('DOMContentLoaded', () => {
    // Create chat scene
    chatScene = new ChatScene('chatScene');
    
    // Create table scene
    tableScene = new TableScene('tableScene');

    // Add GSAP for animations
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.7.1/gsap.min.js';
    document.body.appendChild(script);
});

// Function to add new chat message
function addChatMessage() {
    const messages = [
        "Hello there!",
        "How are you?",
        "This is a 3D chat",
        "Pretty cool, right?",
        "Messages stack up",
        "And animate smoothly"
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    chatScene.addMessage(randomMessage);
}

// Function to rotate table
function rotateTable() {
    tableScene.rotateTable();
}

// Handle window resize
window.addEventListener('resize', () => {
    if (chatScene) chatScene.handleResize();
    if (tableScene) tableScene.handleResize();
});