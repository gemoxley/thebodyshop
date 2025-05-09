let frameImages = [];
let contentImages = [];
let frames = [];
const FRAME_HEIGHT = 650;
const SCROLL_SPEED = 1;
let previousFrameImage = null;
let previousContentImage = null;
let hoveredFrame = null;
let customFont;
function preload() {
  customFont = loadFont('OrticaAngular-Bold.otf');
  for (let i = 1; i <= 6; i++) {
    frameImages.push(loadImage(`frame-${i}.png`));
  }
  const contentFiles = [
    'Intestinal-Diagram.png',
    'Sympathetic-Man.png',
    'Hand-Radiograph.png',
    'Kaishi-Hen-Ribs.png',
    'Arm-Muscle-Ecorche.png',
    'Ribs-Pelvis-Diagram.png',
    'Somatometric-Chart-Bone-Lengths.png',
    'Muscogee-Shell-Carving.jpg',
    'Torben-Friedrich-Anatomy-Pelvis.jpg',
    'Bacchus-Mosaic.jpg',
    'Dagari-Figure-Burkina-Faso.jpg',
    'Teeth.jpg',
    'Tassili-nAjjer.jpg',
    'Leg-Lithograph-Albrecht-Von-Haller.png',
    'Legs-Jacob-Benard-1831.jpg',
    'Copperplate-Engraving-Henry-Mutlow.png',
    'Visayans-Phillipines.png',
    'Traditional-Viet-Medicine.jpg',
  ];
  contentFiles.forEach(file => {
    const img = loadImage(`${file}`);
    img._filename = file;
    contentImages.push(img);
  });
}
function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('canvas-container');
  shuffleArrays();
  initializeGrid();
  textSize(28);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
}
function draw() {
  clear();
  hoveredFrame = null;
  for (let frame of frames) {
    const contentX = frame.x + (frame.width - frame.contentWidth) / 2;
    const contentY = frame.y + (frame.height - frame.contentHeight) / 2;
    if (
      mouseX > contentX && mouseX < contentX + frame.contentWidth &&
      mouseY > contentY && mouseY < contentY + frame.contentHeight
    ) {
      hoveredFrame = frame;
      break;
    }
  }
  for (let frame of frames) {
    if (frame !== hoveredFrame) {
      frame.update();
    }
    frame.display();
  }
  if (hoveredFrame) {
    hoveredFrame.displayHover();
  }
  recycleFrames();
}
function initializeGrid() {
  const visibleFrames = floor(windowWidth / FRAME_HEIGHT) + 2;
  const startX = -FRAME_HEIGHT;
  for (let i = 0; i < visibleFrames; i++) {
    addNewFrame(startX + i * FRAME_HEIGHT, (height - FRAME_HEIGHT) / 3);
  }
}
function addNewFrame(x, y) {
  const frameImg = getRandomUnique(frameImages, previousFrameImage);
  const contentImg = getRandomUnique(contentImages, previousContentImage);
  previousFrameImage = frameImg;
  previousContentImage = contentImg;
  const padding = 20;
  const maxContentWidth = FRAME_HEIGHT - padding * 2;
  const maxContentHeight = FRAME_HEIGHT - padding * 2;
  let contentWidth, contentHeight;
  const contentRatio = contentImg.width / contentImg.height;
  if (contentRatio > 1) {
    contentWidth = maxContentWidth;
    contentHeight = contentWidth / contentRatio;
    if (contentHeight > maxContentHeight) {
      contentHeight = maxContentHeight;
      contentWidth = contentHeight * contentRatio;
    }
  } else {
    contentHeight = maxContentHeight;
    contentWidth = contentHeight * contentRatio;
    if (contentWidth > maxContentWidth) {
      contentWidth = maxContentWidth;
      contentHeight = contentWidth / contentRatio;
    }
  }
  frames.push(new Frame(x, y, FRAME_HEIGHT, FRAME_HEIGHT, frameImg, contentImg, contentWidth, contentHeight, padding));
}
function recycleFrames() {
  for (let i = frames.length - 1; i >= 0; i--) {
    if (frames[i].x + FRAME_HEIGHT < -FRAME_HEIGHT) {
      const farthestRight = frames.reduce((max, frame) => Math.max(max, frame.x), -Infinity);
      const newFrameImg = getRandomUnique(frameImages, previousFrameImage);
      const newContentImg = getRandomUnique(contentImages, previousContentImage);
      previousFrameImage = newFrameImg;
      previousContentImage = newContentImg;
      const padding = 50;
      const maxContentWidth = FRAME_HEIGHT - padding * 2;
      const maxContentHeight = FRAME_HEIGHT - padding * 2;
      let contentWidth, contentHeight;
      const contentRatio = newContentImg.width / newContentImg.height;
      if (contentRatio > 1) {
        contentWidth = maxContentWidth;
        contentHeight = contentWidth / contentRatio;
        if (contentHeight > maxContentHeight) {
          contentHeight = maxContentHeight;
          contentWidth = contentHeight * contentRatio;
        }
      } else {
        contentHeight = maxContentHeight;
        contentWidth = contentHeight * contentRatio;
        if (contentWidth > maxContentWidth) {
          contentWidth = maxContentWidth;
          contentHeight = contentWidth / contentRatio;
        }
      }
      frames[i].x = farthestRight + FRAME_HEIGHT;
      frames[i].frameImg = newFrameImg;
      frames[i].contentImg = newContentImg;
      frames[i].contentWidth = contentWidth;
      frames[i].contentHeight = contentHeight;
    }
  }
}
class Frame {
  constructor(x, y, w, h, frameImg, contentImg, contentW, contentH, padding) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.frameImg = frameImg;
    this.contentImg = contentImg;
    this.contentWidth = contentW;
    this.contentHeight = contentH;
    this.padding = padding;
  }
  update() {
    this.x -= SCROLL_SPEED;
  }
  display() {
    const innerX = this.x + this.padding;
    const innerY = this.y + this.padding;
    const innerWidth = this.width - this.padding * 2;
    const innerHeight = this.height - this.padding * 2;
    fill(252, 239, 240, 255);
    noStroke();
    rect(innerX, innerY, innerWidth, innerHeight);
    const contentX = this.x + (this.width - this.contentWidth) / 2;
    const contentY = this.y + (this.height - this.contentHeight) / 2;
    image(this.contentImg, contentX, contentY, this.contentWidth, this.contentHeight);
    image(this.frameImg, this.x, this.y, this.width, this.height);
  }
  displayHover() {
    const contentX = this.x + (this.width - this.contentWidth) / 2;
    const contentY = this.y + (this.height - this.contentHeight) / 2;
    fill(255, 255, 255, 180);
    noStroke();
    rect(contentX, contentY, this.contentWidth, this.contentHeight);
    tint(255, 76);
    image(this.contentImg, contentX, contentY, this.contentWidth, this.contentHeight);
    noTint();
    fill(67, 62, 63);
    const desc = this.getImageDescription();
    const lines = desc.split('\n');
    const lineHeight = 32;
    const startY = contentY + (this.contentHeight / 2) - ((lines.length - 1) * lineHeight / 2);
    textFont(customFont);
    for (let i = 0; i < lines.length; i++) {
      text(lines[i], contentX + this.contentWidth / 2, startY + (i * lineHeight / 0.5));
    }
  }
  getImageDescription() {
    const filename = this.contentImg._filename;
    const descriptions = {
      'Intestinal-Diagram.png': 'Persian Medical Chart\nMansur ibn Ilyas, c. 1390',
      'Sympathetic-Man.png': 'The Sympathetic Man\nEdwin Hartley Pratt, c. 1901',
      'Hand-Radiograph.png': 'Bones of the Wrist and Hand\nDr. Claude Gouldesbrough, c. 1913',
      'Kaishi-Hen-Ribs.png': 'Notes on the Dissection of Cadavers\nShukuya Aoki, c. 1772',
      'Arm-Muscle-Ecorche.png': 'Lithograph of a Flayed Arm\nCostantino Squanquerillo, c. 1839',
      'Ribs-Pelvis-Diagram.png': 'British Copperplate Engraving\nJean-Joseph Sue, c. 1824',
      'Somatometric-Chart-Bone-Lengths.png': 'Woodblock Illustration\nThe Maijing Tuzhu, c. Qing Dynasty',
      'Muscogee-Shell-Carving.jpg': 'Mvskoke Creation Carving\nChris Thompson, c. 2018',
      'Torben-Friedrich-Anatomy-Pelvis.jpg': 'Five Figures of the Pelvis\nNicolas Henri Jacob, c. 1854',
      'Teeth.jpg': 'Primer on Dental Hygiene\nCalvin Cutter, c. 1849',
      'Leg-Lithograph-Albrecht-Von-Haller.png': 'Homeopathic Nerve Research\nAlbrecht von Haller, c. 1757',
      'Legs-Jacob-Benard-1831.jpg': 'Fascia of the Lower Leg\nJacob Bernard, c. 1831',
      'Copperplate-Engraving-Henry-Mutlow.png': 'Dictionary of Natural History\nMartin St. Ange, c. 1849',
      'Dagari-Figure-Burkina-Faso.jpg': 'Burkina-Faso Statue\nDagari Craftspeople, c. 17th century',
      'Tassili-nAjjer.jpg': 'Algerian Rock Paintings\nNomadic Peoples, c. 10,000 BCE',
      'Bacchus-Mosaic.jpg': 'Mosaic Honoring the God of Wine\nRoman tile-layers, c. 3rd Century',
      'Traditional-Viet-Medicine.jpg': 'Book of Traditional Acupuncture\nVietnamese Doctors, c. 5th Century',
      'Visayans-Phillipines.png': 'Showcasing Batok Tattoos\nChinese Artist (Unknown), c. 1590',
    };
    return descriptions[filename] || 'How Do You View\nYour Own Body?';
  }
}
function getRandomUnique(imageArray, previousImage) {
  if (imageArray.length <= 1) return imageArray[0];
  let newImage;
  do {
    newImage = random(imageArray);
  } while (newImage === previousImage);
  return newImage;
}
function shuffleArrays() {
  shuffleArray(frameImages);
  shuffleArray(contentImages);
}
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
function windowResized() {
  resizeCanvas(windowWidth, FRAME_HEIGHT);
  frames = [];
  initializeGrid();
}