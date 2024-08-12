import {
  getPossibleStartPositions,
  removeRowsUsedByElement,
  getSections,
  getIntersectionOffset,
  getRowsFromElements,
  getRandomSubsetSections,
  choice,
  flipCoin,
  randInt
} from "./utils.js";

// import fontRegular from "./assets/PPObjectSans-Regular.otf";
// import fontHeavy from "./assets/PPObjectSans-Heavy.otf";
// import fontHeavySlanted from "./assets/PPObjectSans-HeavySlanted.otf";

export const handler = ({ inputs, mechanic, sketch }) => {
  const { width, height, location, artist, title, image, color } =
    inputs;
  const artistText = artist.toUpperCase();
  const titleText = title.toUpperCase();
  const locationText = location.toUpperCase();

  let artistElement;
  let titleElement;

  const rows = 32;
  const separation = height / rows;
  const availableRows = Array.from({ length: rows }, (_, k) => k);

  let img;
  let imgGraphic;
  let objSansRegular;
  let objSansHeavy;
  let objSansHeavySlanted;

  const loadImageAndAddFilter = () => {
    imgGraphic = sketch.createGraphics(img.width, img.height);
    imgGraphic.image(img, 0, 0);
    imgGraphic.filter(imgGraphic.GRAY);
    imgGraphic.blendMode(imgGraphic.MULTIPLY);
    imgGraphic.noStroke();
    imgGraphic.fill(color);
    imgGraphic.rect(0, 0, img.width, img.height);
    imgGraphic.blendMode(imgGraphic.BLEND);
  };

  const drawGrid = () => {
    sketch.strokeWeight(width / (6 * 500));
    for (let i = 0; i <= 32; i++) {
      sketch.line(0, separation * i, width, separation * i);
    }
    sketch.strokeWeight(1);
  };

  const setStylingBase = () => {
    sketch.background("white");
    sketch.stroke(color);
    sketch.fill(color);
    // sketch.textFont(objSansRegular);
  };

  const drawArtistElement = () => {
    const element = {};
    element.baseRowSize = randInt(3, 6);
    element.baseSize = element.baseRowSize * separation;

    const words = artistText.split(" ");
    sketch.textSize(element.baseSize * 0.8);
    // sketch.textFont(objSansHeavySlanted);
    const lengths = words.map(t => sketch.textWidth(t));
    element.length = Math.max(width / 3, ...lengths) + width / 20;

    element.startRow = choice(
      getPossibleStartPositions(
        availableRows,
        element.baseRowSize * words.length + 1
      )
    );
    element.endRow =
      element.startRow + words.length * (element.baseRowSize - 1);
    element.y = element.startRow * separation;
    element.x1 = 0;
    element.x2 = element.length + element.x1;

    let x = element.x1;
    while (x < width) {
      for (let i = 0; i < words.length; i++) {
        sketch.text(
          words[i],
          x,
          element.y + (i + 1) * (element.baseSize - separation)
        );
      }
      x += element.length;
    }

    return element;
  };

  const drawTitleElement = () => {
    const element = {};
    element.baseRowSize = 2;
    element.baseSize = element.baseRowSize * separation;

    sketch.textSize(element.baseSize);
    sketch.textStyle(sketch.NORMAL);
    element.length = sketch.textWidth(titleText) + width / 20;

    element.startRow = choice(
      getPossibleStartPositions(availableRows, element.baseRowSize + 1)
    );
    element.endRow = element.startRow + element.baseRowSize;
    element.y = element.startRow * separation;
    element.x1 = 0;
    element.x2 = element.x1 + element.length;

    sketch.text(titleText, 0, element.y + element.baseSize);

    return element;
  };



  const drawRectangle = ({ rx, ry, rw, rh }) => {
    if (img) {
      const rectRatio = rw / rh;
      const imageRatio = imgGraphic.width / imgGraphic.height;
      const sw =
        rectRatio > imageRatio
          ? imgGraphic.width
          : imgGraphic.height * rectRatio;
      const sh =
        rectRatio > imageRatio
          ? imgGraphic.width / rectRatio
          : imgGraphic.height;
      const sx = (imgGraphic.width - sw) / 2;
      const sy = (imgGraphic.height - sh) / 2;
      sketch.image(imgGraphic, rx, ry, rw, rh, sx, sy, sw, sh);
    } else {
      sketch.rect(rx, ry, rw, rh);
    }
  };

  const drawRectangles = () => {
    const maxUsedSpace = Math.max(
      artistElement.x2,
      titleElement.x2,
    );
    const canThereBeTwoColumns = width - maxUsedSpace > width / 4 + width / 20;
    const columnLength = width / 4;
    let bigColumnDrawn = false;
    if (canThereBeTwoColumns && flipCoin()) {
      bigColumnDrawn = true;
    }

    const elementRows = getRowsFromElements([titleElement]);
    const usedSections = getSections(elementRows, 3);
    const freeSections = getSections(availableRows, 3);
    const sections = [
      ...getRandomSubsetSections(
        freeSections,
        freeSections.length > 2
          ? randInt(freeSections.length - 2, freeSections.length)
          : freeSections.length
      ),
      ...getRandomSubsetSections(usedSections, randInt(0, usedSections.length))
    ];

    for (const section of sections) {
      const [row, rowLength] = section;
      const rectRowHeight = rowLength;
      const separateInColumns = bigColumnDrawn || flipCoin();
      const offset = getIntersectionOffset(
        {
          startRow: row,
          endRow: row + rowLength - 1
        },
        [titleElement]
      );
      const leftWidth = width - offset;
      const rectY = row * separation;
      const rectHeight = rectRowHeight * separation;
      if (separateInColumns) {
        drawRectangle({
          rx: offset,
          ry: rectY,
          rw: leftWidth - (columnLength + width / 20),
          rh: rectHeight
        });
        drawRectangle({
          rx: width - columnLength,
          ry: rectY,
          rw: columnLength,
          rh: rectHeight
        });
      } else {
        drawRectangle({
          rx: offset,
          ry: rectY,
          rw: leftWidth,
          rh: rectHeight
        });
      }
    }

    if (bigColumnDrawn) {
      drawRectangle({
        rx: width - columnLength,
        ry: 0,
        rw: width - columnLength,
        rh: height
      });
    }
  };

  sketch.preload = () => {
    if (image) {
      img = sketch.loadImage(URL.createObjectURL(image));
    }
    // objSansRegular = sketch.loadFont(fontRegular);
    // objSansHeavy = sketch.loadFont(fontHeavy);
    // objSansHeavySlanted = sketch.loadFont(fontHeavySlanted);
  };

  sketch.setup = () => {
    sketch.createCanvas(width, height);
    if (img) {
      loadImageAndAddFilter();
    }
  };

  sketch.draw = () => {
    setStylingBase();

    drawGrid();

    artistElement = drawArtistElement();

    removeRowsUsedByElement(availableRows, artistElement);

    titleElement = drawTitleElement();


    removeRowsUsedByElement(availableRows, titleElement);
  

    drawRectangles();

    mechanic.done();
  };
};

export const inputs = {
  location: {
    type: "text",
    default: "Jack Shainman Gallery"
  },
  artist: {
    type: "text",
    default: "Tyler Mitchell"
  },
  title: {
    type: "text",
    default: "Dreaming in Real Time"
  },
  image: {
    type: "image"
  },
  color: {
    type: "color",
    default: "#E94225",
    model: "hex"
  },
  width: {
    type: "number",
    default: 500,
    editable: false
  },
  height: {
    type: "number",
    default: 600,
    editable: false
  },
  mySlider: { 
    type: "number", 
    min: 0, 
    max: 255, 
    step: 1, 
    slider: true, 
    default: 0 
   }
};

export const presets = {
  x2: {
    width: 1000,
    height: 1200
  },
  x4: {
    width: 1500,
    height: 1800
  }
};

export const settings = {
  engine: require("@mechanic-design/engine-p5")
};