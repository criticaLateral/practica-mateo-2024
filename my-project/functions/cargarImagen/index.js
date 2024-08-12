

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
    // imgGraphic.fill(color);
    // imgGraphic.rect(0, 0, img.width, img.height);
    imgGraphic.blendMode(imgGraphic.BLEND);
  };

  const putImageOnCanvas = () => {
  // https://editor.p5js.org/enickles/sketches/QpS9ujOuL
  // vertical
  if (imgGraphic.height >= imgGraphic.width) {
    sketch.image(imgGraphic, 0, 0, imgGraphic.width * (height / imgGraphic.height), imgGraphic.height * (height / imgGraphic.height));
    // Horizontal
  } else if (imgGraphic.width > imgGraphic.height) {

    sketch.image(imgGraphic, 0, 0, imgGraphic.width * (width / imgGraphic.width), imgGraphic.height * (width / imgGraphic.width));
  } 
    // sketch.image(imgGraphic, 0, 0, sketch.width, sketch.height, 0, 0, imgGraphic.width,  imgGraphic.height);
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

    if (img)  {
      putImageOnCanvas();
    }


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