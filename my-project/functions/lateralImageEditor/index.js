export const handler = ({ inputs, mechanic, sketch }) => {
  const {
    ancho,
    altura,
    imagen,
    color,
    colorSecundario,
    colorPrimario,
    habilitarColores,
    habilitarHalftone,
    columnasHalftone,
    usarCirculos,
    usarCuadrados,
    habilitarPixelado,
    columnasDePixeles,
    nivelThreshold,
    habilitarThreshold,
  } = inputs;

  let img;
  let imgGraphic;
  let imgHalftone;
  let imgPixelada;
  let imgThreshold;

  const loadImageAndAddFilter = () => {
    imgGraphic = sketch.createGraphics(img.width, img.height);
    imgGraphic.image(img, 0, 0);

    imgHalftone = sketch.createGraphics(img.width, img.height);
    imgHalftone.image(img, 0, 0);

    imgPixelada = sketch.createGraphics(img.width, img.height);
    imgPixelada.image(img, 0, 0);

    imgThreshold = sketch.createGraphics(img.width, img.height);
    imgThreshold.image(img, 0, 0);

    if (habilitarColores) {
      // capa para el color secundario
      imgGraphic.filter(imgGraphic.GRAY);
      imgGraphic.blendMode(imgGraphic.SCREEN);
      imgGraphic.fill(colorSecundario);
      imgGraphic.noStroke();
      imgGraphic.rect(0, 0, img.width, img.height);

      // capa para color primario
      imgGraphic.blendMode(imgGraphic.SCREEN);
      imgGraphic.blendMode(imgGraphic.OVERLAY);
      imgGraphic.fill(colorPrimario);
      imgGraphic.noStroke();
      imgGraphic.rect(0, 0, img.width, img.height);
    }

    if (habilitarHalftone) {
      imgHalftone.fill(colorPrimario);
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

        if (usarCirculos) {
          imgHalftone.noStroke();
          imgHalftone.fill(255);
          imgHalftone.ellipse(x, y, amplitud, amplitud);
        } else if (usarCuadrados) {
          imgHalftone.noStroke();
          imgHalftone.fill(255);
          imgHalftone.rect(
            x - amplitud / 2,
            y - amplitud / 2,
            amplitud,
            amplitud
          );
        }
      }
    }
    const threshold = 80;

    if (habilitarPixelado) {
      imgPixelada.fill(colorPrimario);
      imgGraphic.filter(imgGraphic.GRAY);
      imgPixelada.noStroke();
      imgPixelada.rect(0, 0, img.width, img.height);
      let colTotal = columnasDePixeles;
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
        const pixelSize = columnasDePixeles;
        for (let y = 0; y < img.height; y += pixelSize) {
          for (let x = 0; x < img.width; x += pixelSize) {
            // valor de efecto escala de grises
            const grayscaleValue = imgGraphic.get(x, y)[0]; 
            if (grayscaleValue <= threshold) {
              // pixeles a negro
              imgPixelada.fill(0); 
            } else {
              // pixeles a blanco
              imgPixelada.fill(colorPrimario); 
            }
            imgPixelada.noStroke();
            imgPixelada.rect(x, y, pixelSize, pixelSize);
          }
        }
      }
    }

    if (habilitarThreshold) {
      imgThreshold.filter(imgThreshold.THRESHOLD, nivelThreshold);
      imgThreshold.blendMode(imgGraphic.BLEND);
      imgThreshold.fill(colorPrimario);
      imgGraphic.noStroke();
      imgGraphic.rect(0, 0, img.width, img.height);
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

    sketch.image(imgGraphic, x, y, scaledWidth, scaledHeight);

    if (habilitarHalftone) {
      sketch.image(imgHalftone, x, y, scaledWidth, scaledHeight);
    } else {
      sketch.image(imgGraphic, x, y, scaledWidth, scaledHeight);
    }

    if (habilitarPixelado) {
      sketch.image(imgPixelada, x, y, scaledWidth, scaledHeight);
    } else {
      sketch.image(imgGraphic, x, y, scaledWidth, scaledHeight);
    }

    if (habilitarThreshold) {
      sketch.image(imgThreshold, x, y, scaledWidth, scaledHeight);
    } else {
      sketch.image(imgGraphic, x, y, scaledWidth, scaledHeight);
    }
  };

  const setStylingBase = () => {
    sketch.background("white");
    sketch.stroke(colorPrimario);
    sketch.fill(colorPrimario);
  };

  sketch.preload = () => {
    if (imagen) {
      img = sketch.loadImage(URL.createObjectURL(imagen));
    } else {
      img = sketch.loadImage("static/featured.jpg");
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
  habilitarColores: {
    type: "boolean",
    default: false,
    editable: true,
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
  usarCirculos: {
    type: "boolean",
    default: true,
    editable: true,
  },
  usarCuadrados: {
    type: "boolean",
    default: false,
    editable: true,
  },
  habilitarPixelado: {
    type: "boolean",
    default: false,
    editable: true,
  },
  columnasDePixeles: {
    type: "number",
    min: 1.0,
    max: 10.0,
    step: 1.0,
    slider: true,
    default: 3.0,
  },
  habilitarThreshold: {
    type: "boolean",
    default: false,
    editable: true
  },
  nivelThreshold: { 
    type: "number", 
    min: 0.0, 
    max: 1.0, 
    step: 0.01, 
    slider: true, 
    default: 0.5 
   },
  colorPrimario: {
    type: "color",
    default: "#39ff14",
    model: "hex",
  },
  colorSecundario: {
    type: "color",
    default: "#DE3163",
    model: "hex",
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
  optimize: true,
  hideScaleToFit: true,
  hideGenerate: true,
  debounceInputs: true,
  debounceDelay: 100,
  hidePresets: true,
};
