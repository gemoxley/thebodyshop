let customFont;
let message = "Welcome, welcome, welcome in! Don’t mind the mess and do take care as you step over the cave paintings; I’m just back from my latest expedition across time and space to ensure our clients receive only the finest temporal handicrafts! What may I do for you?";
let typedMessage = "";
let index = 0;
let typingSpeed = 50;
let lastTypeTime = 0;
let typing = true;
let colors = [];
let colorChangeDuration = 3000;
let colorStartTime;
let margin = 200;
let heartImage;
let brainImage;
let brainRotation = 0;
let currentMood = "Curious";
let bpm;
let heartX, heartY;
let heartBaseSize = 200;
let heartScale = 1;
let button1, button2, nextButton;
function preload() {
    customFont = loadFont('OrticaAngular-Bold.otf');
    heartImage = loadImage('Red-Heart.png');
    brainImage = loadImage('The-Mind.png');
}
function setup() {
    const canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('canvas-container');
    textFont(customFont);
    textSize(min(width, height) / 30);
    textStyle(BOLD);
    textAlign(LEFT, TOP);
    colors = [
        color('#F49260'),
        color('#F6AE2D'),
        color('#EF9224')
    ];
    colorStartTime = millis();
    lastTypeTime = millis();
    bpm = int(random(80, 111));
    heartX = width - margin;
    heartY = margin;
    button1 = createButton("I want a new body!");
    button2 = createButton("What the heck is this crazy place?");
    button1.style('z-index', '100');
    button2.style('z-index', '100');
    button1.mousePressed(() => {
        message = "Ah, you’ve come in search of your dream body? Something that fits you better than... this ol’ sack of skin and bones you walked in with? You've come to the right place! Here at The Body Shop, we pride ourselves in helping our customers achieve perfection.";
        typedMessage = "";
        index = 0;
        typing = true;
        bpm -= int(random(10, 21));
        bpm = max(bpm, 30);
        currentMood = "Excited";
        const x = button1.position().x;
        const y = button1.position().y;
        hideInitialButtons();
        nextButton = createButton("Enter The Body Shop");
        nextButton.style('z-index', '100');
        nextButton.position(x, y);
        nextButton.mousePressed(() => {
            window.location.href = 'table.html';
        });
    });
    button2.mousePressed(() => {
        message = "This, my friend, is The Body Shop: your one-stop destination for the finest limbs, heads, and torsos across timelines! No refunds, though— our return policy got lost somewhere in the 18th century.";
        typedMessage = "";
        index = 0;
        typing = true;
        bpm += int(random(10, 21));
        currentMood = "Scared";
        const x = button2.position().x;
        const y = button2.position().y;
        hideInitialButtons();
        nextButton = createButton("Return to Lobby");
        nextButton.style('z-index', '100');
        nextButton.position(x, y);
        nextButton.mousePressed(() => {
            window.location.href = 'welcome.html';
        });
    });
    setTimeout(() => {
        positionButtonCentered(button1, windowHeight / 2 - 100);
        positionButtonCentered(button2, windowHeight / 2 + 100);
    }, 0);
}
function draw() {
    background(67, 62, 63);
    let elapsedTime = millis() - colorStartTime;
    let totalCycleTime = colorChangeDuration * colors.length;
    let t = (elapsedTime % totalCycleTime) / colorChangeDuration;
    let indexA = floor(t) % colors.length;
    let indexB = (indexA + 1) % colors.length;
    let lerpAmt = t % 1;
    let currentColor = lerpColor(colors[indexA], colors[indexB], lerpAmt);
    fill(currentColor);
    text(typedMessage, margin, margin, 500);
    if (typing && millis() - lastTypeTime > typingSpeed) {
        typedMessage += message.charAt(index);
        lastTypeTime = millis();
        index++;
        if (index >= message.length) {
            typing = false;
        }
    }
    push();
    translate(heartX, heartY);
    let bpmMs = 60000 / bpm;
    let beatPhase = (millis() % bpmMs) / bpmMs;
    heartScale = 0.95 + 0.1 * sin(beatPhase * TWO_PI);
    imageMode(CENTER);
    let heartSize = heartBaseSize * heartScale;
    textAlign(CENTER, BOTTOM);
    textSize(28);
    fill(currentColor);
    text("User vitals", 0, -120);
    image(heartImage, 0, 0, heartSize, heartSize);
    textAlign(CENTER, TOP);
    textSize(28);
    fill(currentColor);
    text(bpm + " BPM", 0, heartBaseSize / 2 + 30);
    pop();
    push();
    let brainY = heartY + heartBaseSize + 100;
    translate(heartX, brainY);
    let bpmPerSec = bpm / 60;
    let degreesPerSecond = bpmPerSec * 360;
    let degreesPerFrame = degreesPerSecond / frameRate();
    brainRotation += degreesPerFrame;
    rotate(radians(brainRotation));
    imageMode(CENTER);
    let brainSize = heartBaseSize;
    image(brainImage, 0, 0, brainSize, brainSize);
    resetMatrix();
    textAlign(CENTER, TOP);
    textSize(28);
    fill(currentColor);
    text(currentMood, heartX, brainY + brainSize / 2 + 30);
    pop();
}
function positionButtonCentered(button, yPos) {
    button.position((windowWidth - button.width) / 2, yPos);
}
function hideInitialButtons() {
    if (button1) button1.hide();
    if (button2) button2.hide();
}
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    heartX = width - margin;
    heartY = margin;
    if (button1 && button1.style('display') !== 'none') {
        positionButtonCentered(button1, windowHeight / 2 - 100);
    }
    if (button2 && button2.style('display') !== 'none') {
        positionButtonCentered(button2, windowHeight / 2 + 100);
    }
    if (nextButton && nextButton.style('display') !== 'none') {
        const x = nextButton.position().x;
        const y = nextButton.position().y;
        nextButton.position(x, y);
    }
}
if (document.readyState === 'complete') {
    if (typeof window.setup === 'function') setup();
} else {
    window.addEventListener('load', () => {
        if (typeof window.setup === 'function') setup();
    });
}