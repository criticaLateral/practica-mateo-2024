export const handler = ({ inputs, mechanic, sketch }) => {
  const { ancho, altura, imagen, color, habilitarHalftone, columnasHalftone } =
    inputs;

  const rows = 32;
  const separation = altura / rows;
  const availableRows = Array.from({ length: rows }, (_, k) => k);

  let img;
  let imgGraphic;
  let imgHalftone;

  const loadImageAndAddFilter = () => {
    imgGraphic = sketch.createGraphics(img.width, img.height);
    imgHalftone = sketch.createGraphics(img.width, img.height);

    imgGraphic.image(img, 0, 0);
    imgHalftone.image(img, 0, 0);

    // implementacion adaptada desde
    // https://tabreturn.github.io/code/processing/python/2019/02/09/processing.py_in_ten_lessons-6.3-_halftones.html

    if (habilitarHalftone) {
      imgHalftone.fill(color);
      imgHalftone.rect(0, 0, img.width, img.height);
      let colTotal = columnasHalftone;
      let cellSize = img.width / colTotal;
      let rowTotal = Math.round(img.height / cellSize);
      let col = 0;
      let row = 0;
      for (let i = 0; i < colTotal * rowTotal; i++) {
        let x = col * cellSize;
        let y = row * cellSize;
        col = col + 1;

        if (col >= colTotal) {
          col = 0;
          row = row + 1;
        }
        x = x + cellSize / 2;
        y = y + cellSize / 2;
        let colorPixel = imgGraphic.get(x, y);
        let brillo = imgGraphic.brightness(colorPixel);
        let amplitud = (10 * brillo) / 200.0;
        imgHalftone.stroke();
        imgHalftone.fill(255);
        imgHalftone.ellipse(x, y, amplitud, amplitud);
      }
    }
  };

  const putImageOnCanvas = () => {
    const imageAspectRatio = imgGraphic.width / imgGraphic.height;
    const maxWidth = window.innerWidth;
    const maxHeight = window.innerHeight;

    let newWidth, newHeight;
    if (imageAspectRatio > maxWidth / maxHeight) {
      newWidth = maxWidth;
      newHeight = maxWidth / imageAspectRatio;
    } else {
      newHeight = maxHeight;
      newWidth = maxHeight * imageAspectRatio;
    }

    sketch.resizeCanvas(newWidth, newHeight);

    let scaledWidth = newWidth;
    let scaledHeight = newHeight;

    if (imgGraphic.width === imgGraphic.height) {
      scaledWidth = Math.min(newWidth, newHeight);
      scaledHeight = scaledWidth;
    } else {
      if (imgGraphic.width > newWidth) {
        scaledWidth = imgGraphic.width;
      }
      if (imgGraphic.height > newHeight) {
        scaledHeight = imgGraphic.height;
      }
    }

    const x = (newWidth - scaledWidth) / 2;
    const y = (newHeight - scaledHeight) / 2;

    if (habilitarHalftone) {
      sketch.image(imgHalftone, x, y, scaledWidth, scaledHeight);
    } else {
      sketch.image(imgGraphic, x, y, scaledWidth, scaledHeight);
    }
  };

  const setStylingBase = () => {
    sketch.background("white");
    sketch.noStroke();
    sketch.fill(color);
  };

  sketch.preload = () => {
    if (imagen) {
      img = sketch.loadImage(URL.createObjectURL(imagen));
    } else {
      img = sketch.loadImage("static/imagenDePrueba02.jpeg");
    }
  };

  sketch.setup = () => {
    sketch.createCanvas(ancho, altura);
    if (img) {
      loadImageAndAddFilter();
    }
  };

  sketch.draw = () => {
    setStylingBase();

    if (img) {
      putImageOnCanvas();
    }

    mechanic.done();
  };
};

export const inputs = {
  imagen: {
    type: "image",
  },
  ancho: {
    type: "number",
    default: 500,
    editable: true,
  },
  altura: {
    type: "number",
    default: 600,
    editable: true,
  },
  color: {
    type: "color",
    default: "#39ff14",
    model: "hex",
  },
  habilitarHalftone: {
    type: "boolean",
    default: false,
    editable: true,
  },
  columnasHalftone: {
    type: "number",
    min: 10.0,
    max: 300.0,
    step: 1.0,
    slider: true,
    default: 100.0,
  },
};

export const presets = {
  vertical: {
    ancho: 1080,
    altura: 1920,
  },
  horizontal: {
    ancho: 1920,
    altura: 1080,
  },
  cuadrado: {
    ancho: 1920,
    altura: 1920,
  },
};

export const settings = {
  engine: require("@mechanic-design/engine-p5"),
};
