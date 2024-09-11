export const handler = ({ inputs, mechanic, sketch }) => {
  const { ancho, altura, imagen, color, habilitarPixelado, columnasDePixeles, colorPrimario, colorSecundario } =
    inputs;

  let img;
  let imgGraphic;
  let imgPixelada;

  const loadImageAndAddFilter = () => {
    
    imgGraphic = sketch.createGraphics(img.width, img.height);
    imgPixelada = sketch.createGraphics(img.width, img.height);
    imgGraphic.image(img, 0, 0);
    imgPixelada.image(img, 0, 0);

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
              imgPixelada.fill(colorSecundario); 
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

    if (habilitarPixelado) {
      sketch.image(imgPixelada, x, y, scaledWidth, scaledHeight);
    } else {
      sketch.image(imgGraphic, x, y, scaledWidth, scaledHeight);
    }
  };

  const setStylingBase = () => {
    sketch.background("white");
    sketch.noStroke();
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
  colorPrimario: {
    type: "color",
    default: "#39ff14",
    model: "hex",
  },
  colorSecundario: {
    type: "color",
    default: "#000000",
    model: "hex",
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
};
