let monster;
let detachedParts = [];
let images = {};
let draggingPart = null;
let offsetX, offsetY;
const SNAP_DISTANCE = 50;
let trayPositions = {};

function preload() {
    images.heads = [
        loadImage('Copperplate-Skull.png'),
        loadImage('Dagari-Skull.png')
    ];
    images.ribcages = [loadImage('Ribcage.png')];
    images.hips = [loadImage('Sacrum.png')];
    images.leftArms = [
        loadImage('Muscle-Left-Arm.png'),
        loadImage('Turkish-Mosaic-Left-Arm.png')
    ];
    images.rightArms = [
        loadImage('Muscle-Right-Arm.png'),
        loadImage('Mvskoke-Right-Arm.png'),
        loadImage('Viet-Medicine-Right-Arm.png')
    ];
    images.leftLegs = [
        loadImage('Muscle-Left-Leg.png'),
        loadImage('Visayans-Left-Leg.png')
    ];
    images.rightLegs = [
        loadImage('Muscle-Right-Leg.png'),
        loadImage('Algeria-Right-Leg.png')
    ];
}

class Part {
    constructor(type, img, x, y) {
        this.type = type;
        this.img = img;
        this.x = x;
        this.y = y;
        this.isHovered = false;
        this.alpha = 255;
        this.isFading = false;
    }

    display() {
        if (!this.img) return;
        push();
        tint(255, this.alpha);
        image(this.img, this.x, this.y);
        pop();
        if (this.isHovered) this.showHighlight(this.img.width, this.img.height);
        if (this.isFading) this.fadeStep();
    }

    updateHover(mx, my) {
        if (!this.img) return;
        const w = this.img.width;
        const h = this.img.height;
        this.isHovered = (mx > this.x && mx < this.x + w &&
                          my > this.y && my < this.y + h);
    }

    isClicked(mx, my) {
        return this.isHovered;
    }

    showHighlight(w, h) {
        push();
        noFill();
        stroke(255, 0, 0);
        strokeWeight(2);
        rect(this.x, this.y, w, h);
        pop();
    }

    fadeOut(callback) {
        this.isFading = true;
        this.onFadeComplete = callback;
    }

    fadeStep() {
        this.alpha -= 255 / (60 * 5);
        if (this.alpha <= 0) {
            this.alpha = 0;
            this.isFading = false;
            if (this.onFadeComplete) this.onFadeComplete();
        }
    }
}
class Monster {
    constructor() {
        function getRandomImage(arr, fallbackName) {
            if (!arr || arr.length === 0) {
                console.warn(`No images found for ${fallbackName}`);
                return null;
            }
            return random(arr);
        }
        this.parts = {
            head: new Part('head', getRandomImage(images.heads, 'heads'), trayPositions.head.x, trayPositions.head.y),
            ribcage: new Part('ribcage', getRandomImage(images.ribcages, 'ribcages'), trayPositions.ribcage.x, trayPositions.ribcage.y),
            leftArm: new Part('leftArm', getRandomImage(images.leftArms, 'leftArms'), trayPositions.leftArm.x, trayPositions.leftArm.y),
            rightArm: new Part('rightArm', getRandomImage(images.rightArms, 'rightArms'), trayPositions.rightArm.x, trayPositions.rightArm.y),
            hips: new Part('hips', getRandomImage(images.hips, 'hips'), trayPositions.hips.x, trayPositions.hips.y),
            leftLeg: new Part('leftLeg', getRandomImage(images.leftLegs, 'leftLegs'), trayPositions.leftLeg.x, trayPositions.leftLeg.y),
            rightLeg: new Part('rightLeg', getRandomImage(images.rightLegs, 'rightLegs'), trayPositions.rightLeg.x, trayPositions.rightLeg.y)
        };
    }
    showTrays() {
        for (let partType in trayPositions) {
            const pos = trayPositions[partType];
            const w = 100;
            const h = 100;
            push();
            fill(255);
            stroke(0);
            rect(pos.x - 10, pos.y - 10, w + 20, h + 20);
            pop();
        }
    }
    showParts() {
        for (let part in this.parts) {
            this.parts[part]?.display();
        }
    }
    checkClick() {
        for (let part in this.parts) {
            this.parts[part]?.updateHover(mouseX, mouseY);
            if (this.parts[part]?.isClicked(mouseX, mouseY)) {
                detachedParts.push(this.parts[part]);
                delete this.parts[part];
                break;
            }
        }
    }
    trySnap(part) {
        const target = trayPositions[part.type];
        if (dist(part.x, part.y, target.x, target.y) < SNAP_DISTANCE) {
            part.x = target.x;
            part.y = target.y;
            this.parts[part.type] = part;
            return true;
        }
        return false;
    }
    randomizePart(partType) {
        if (partType === 'arms') {
            this.fadeAndReplace('leftArm', images.leftArms, trayPositions.leftArm.x, trayPositions.leftArm.y);
            this.fadeAndReplace('rightArm', images.rightArms, trayPositions.rightArm.x, trayPositions.rightArm.y);
        } else if (partType === 'legs') {
            this.fadeAndReplace('leftLeg', images.leftLegs, trayPositions.leftLeg.x, trayPositions.leftLeg.y);
            this.fadeAndReplace('rightLeg', images.rightLegs, trayPositions.rightLeg.x, trayPositions.rightLeg.y);
        } else if (partType === 'hipsRibs') {
            this.fadeAndReplace('hips', images.hips, trayPositions.hips.x, trayPositions.hips.y);
            this.fadeAndReplace('ribcage', images.ribcages, trayPositions.ribcage.x, trayPositions.ribcage.y);
        } else {
            const imgSet = images[partType + (partType.includes('Arm') || partType.includes('Leg') ? 's' : '')];
            const pos = trayPositions[partType];
            this.fadeAndReplace(partType, imgSet, pos.x, pos.y);
        }
    }
    fadeAndReplace(partType, imageSet, x, y) {
        const img = imageSet && imageSet.length ? random(imageSet) : null;
        if (!img) {
            console.warn(`No image available for ${partType}`);
            return;
        }
        if (this.parts[partType]) {
            let oldPart = this.parts[partType];
            oldPart.fadeOut(() => {
                this.parts[partType] = new Part(partType, img, x, y);
            });
        } else {
            this.parts[partType] = new Part(partType, img, x, y);
        }
    }
}
function setup() {
    const container = document.getElementById('canvas-container');
    let canvas = createCanvas(container.offsetWidth, container.offsetHeight);
    canvas.parent(container);
    updateTrayPositions();

    const buttonContainer = select('#monster-button-bar');
    createButton('Randomize Whole Body').parent(buttonContainer).mousePressed(() => {
        detachedParts = [];
        monster = new Monster();
    });
    createButton('Randomize Head').parent(buttonContainer).mousePressed(() => { if (monster) monster.randomizePart('head'); });
    createButton('Randomize Arms').parent(buttonContainer).mousePressed(() => { if (monster) monster.randomizePart('arms'); });
    createButton('Randomize Hips + Ribs').parent(buttonContainer).mousePressed(() => { if (monster) monster.randomizePart('hipsRibs'); });
    createButton('Randomize Legs').parent(buttonContainer).mousePressed(() => { if (monster) monster.randomizePart('legs'); });
    createButton('Confirm Perfect Body').parent(buttonContainer).mousePressed(confirmPerfectBody);

    monster = new Monster();
}
function updateTrayPositions() {
    const cx = width / 2;
    const cy = height / 2;
    const baseOffsetX = 120 + 100;
    const baseOffsetY = 120 + 100;
    trayPositions = {
        head: { x: cx - 50, y: cy - baseOffsetY * 2.5 },
        ribcage: { x: cx - 50, y: cy - baseOffsetY },
        leftArm: { x: cx - baseOffsetX - 50, y: cy - baseOffsetY },
        rightArm: { x: cx + baseOffsetX - 50, y: cy - baseOffsetY },
        hips: { x: cx - 50, y: cy },
        leftLeg: { x: cx - baseOffsetX - 50, y: cy + baseOffsetY },
        rightLeg: { x: cx + baseOffsetX - 50, y: cy + baseOffsetY }
    };
}
function draw() {
    clear();
    if (monster) {
        monster.showTrays();
        monster.showParts();
    }
    for (let part of detachedParts) {
        part.updateHover(mouseX, mouseY);
        part.display();
    }
    if (draggingPart) draggingPart.display(mouseX + offsetX, mouseY + offsetY);
}
function mousePressed() {
    if (monster) monster.checkClick();
    for (let i = detachedParts.length - 1; i >= 0; i--) {
        if (detachedParts[i].isClicked(mouseX, mouseY)) {
            draggingPart = detachedParts[i];
            offsetX = draggingPart.x - mouseX;
            offsetY = draggingPart.y - mouseY;
            break;
        }
    }
}
function mouseReleased() {
    if (draggingPart) {
        draggingPart.x = mouseX + offsetX;
        draggingPart.y = mouseY + offsetY;
        if (monster.trySnap(draggingPart)) detachedParts = detachedParts.filter(p => p !== draggingPart);
        draggingPart = null;
    }
}
function confirmPerfectBody() {
    alert('Are you sure this is PERFECT?');
    for (let partType in monster.parts) {
        const part = monster.parts[partType];
        if (part) {
            part.fadeOut(() => {
                delete monster.parts[partType];
            });
        }
    }
    for (let part of detachedParts) {
        part.fadeOut(() => {
            detachedParts = detachedParts.filter(p => p !== part);
        });
    }
}
function windowResized() {
    const container = document.getElementById('canvas-container');
    resizeCanvas(container.offsetWidth, container.offsetHeight);
    updateTrayPositions();
}