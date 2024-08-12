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


  const setStylingBase = () => {
    sketch.background("white");
  };

  sketch.preload = () => {
    if (image) {
      img = sketch.loadImage(URL.createObjectURL(image));
    }
  };

  sketch.setup = () => {
    sketch.createCanvas(width, height);
    if (img) {
      loadImageAndAddFilter();
    }
  };

  sketch.draw = () => {
    setStylingBase();

    mechanic.done();
  };
};

export const inputs = {
  image: {
    type: "image"
  },
  width: {
    type: "number",
    default: 500,
    editable: true
  },
  height: {
    type: "number",
    default: 600,
    editable: true
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