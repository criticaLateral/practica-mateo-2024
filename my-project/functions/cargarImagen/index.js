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
  const { width, height, image, color } =
    inputs;

  const rows = 32;
  const separation = height / rows;
  const availableRows = Array.from({ length: rows }, (_, k) => k);

  let img;
  let imgGraphic;

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

    drawRectangles();

    mechanic.done();
  };
};

export const inputs = {
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