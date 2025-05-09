let customFont;
let message1 = "Skin Deep seeks to explore the ways that humanity has interacted with and depicted our shared human form throughout time and history. Throughout intense research and archival searching (particularly of medical illustrations), different body parts- such as limbs, ribs, and skulls- have been sourced from open-source images and turned into interactable assets for the user of the website to play with and assemble into a Frankenstein’s Monster of their very own through assembling body parts together in a p5.js sketch. The twist of the website comes at the end, when the user discovers that they don’t keep to keep/save their newly idealized body but instead that it disappears completely. The entire premise is designed to be a sham; much like in real life, the idea is that humans cannot choose what we’re born with and can only learn from how others deal with the same issue.";
let message2 = "There is no one perfect body. Everyone on earth is born with the body that they have, and that’s the perfect body for THEM—whether it be through a journey of getting tattoos, gender-affirming care, beating an eating disorder or simply through radical self-love. People throughout time have all dealt with the same issues to our modern selves, but without the added pressure of the Internet having the ability to show people airbrushed or otherwise falsified into perfection. Their depictions of an imperfect human form offer a lens into ways of understanding and resilience that resonates today.";
let colors1 = [];
let colors2 = [];
let colorChangeDuration = 3000;
let colorStartTime1;
let colorStartTime2;
let margin = 100;
function preload() {
    customFont = loadFont('OrticaAngular-Bold.otf');
}
function setup() {
    createCanvas(windowWidth, windowHeight);
    textFont(customFont);
    textSize(min(width, height) / 35);
    textStyle(BOLD);
    textAlign(LEFT, TOP);
    colors1 = [
        color('#FCEFF0'),
        color('#FDECEF'),
        color('#FCEFF0')
    ];
    colors2 = [
        color('#F6C05F'),
        color('#F6AE2D'),
        color('#EF9224')
    ];
    colorStartTime1 = millis();
    colorStartTime2 = millis();
}
function draw() {
    background(67, 62, 63);
    let elapsedTime1 = millis() - colorStartTime1;
    let totalCycleTime1 = colorChangeDuration * colors1.length;
    let t1 = (elapsedTime1 % totalCycleTime1) / colorChangeDuration;
    let indexA1 = floor(t1) % colors1.length;
    let indexB1 = (indexA1 + 1) % colors1.length;
    let lerpAmt1 = t1 % 1;
    let currentColor1 = lerpColor(colors1[indexA1], colors1[indexB1], lerpAmt1);
    fill(currentColor1);
    text(message1, margin, margin, width - 2 * margin);
    let maxWidth = width - 2 * margin;
    let words = message1.split(' ');
    let lines = [];
    let currentLine = '';
    for (let w = 0; w < words.length; w++) {
        let testLine = currentLine + words[w] + ' ';
        if (textWidth(testLine) > maxWidth && currentLine !== '') {
            lines.push(currentLine);
            currentLine = words[w] + ' ';
        } else {
            currentLine = testLine;
        }
    }
    lines.push(currentLine);
    let textHeight = textAscent() + textDescent();
    let blockHeight = lines.length * textHeight + 20;
    let elapsedTime2 = millis() - colorStartTime2;
    let totalCycleTime2 = colorChangeDuration * colors2.length;
    let t2 = (elapsedTime2 % totalCycleTime2) / colorChangeDuration;
    let indexA2 = floor(t2) % colors2.length;
    let indexB2 = (indexA2 + 1) % colors2.length;
    let lerpAmt2 = t2 % 1;
    let currentColor2 = lerpColor(colors2[indexA2], colors2[indexB2], lerpAmt2);
    fill(currentColor2);
    text(message2, margin, margin + blockHeight + 30, width - 2 * margin);
}
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
if (document.readyState === 'complete') {
  if (typeof window.setup === 'function') setup();
} else {
  window.addEventListener('load', () => {
      if (typeof window.setup === 'function') setup();
  });
}