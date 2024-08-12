export const handler = ({ inputs, mechanic, sketch }) => {
  const { width, height, color, image } = inputs;
  sketch.setup = () => {
    sketch.createCanvas(500, 500);
    sketch.background(200);
  };

  sketch.draw = () => {
    sketch.background(color);
    mechanic.done();
  };

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

  sketch.setup = () => {
      sketch.createCanvas(width, height);
      if (img) {
        loadImageAndAddFilter();
      }
    };
  };


export const inputs = {
  myImage: { 
      type: "image" 
     }
};

export const settings = {
  engine: require("@mechanic-design/engine-p5"),
};
