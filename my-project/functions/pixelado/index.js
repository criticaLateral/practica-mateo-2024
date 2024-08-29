export const handler = ({ inputs, mechanic, sketch }) => {
  const { ancho, altura, imagen, color, habilitarPixelado } = inputs;

  const rows = 32;
  const separation = altura / rows;
  const availableRows = Array.from({ length: rows }, (_, k) => k);

  let img;
  let imgGraphic;
  let imgPixelada;

  const loadImageAndAddFilter = () => {
    imgGraphic = sketch.createGraphics(img.width, img.height);
    imgPixelada = sketch.createGraphics(img.width, img.height);
    imgGraphic.image(img, 0, 0);
    imgPixelada.image(img, 0, 0);

    if (habilitarPixelado) {
      imgPixelada.fill(color);
      imgPixelada.rect(0, 0, img.width, img.height);
      let colTotal = 200.0;
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

        x = x + cellSize;
        y = y + cellSize;
        let colorPixel = imgGraphic.get(x, y);
        let brillo = imgGraphic.brightness(colorPixel);
        let amplitud = (15 * brillo) / 200.0;
        imgPixelada.stroke(color);
        imgPixelada.fill(255);
        imgPixelada.rect(x, y, amplitud, amplitud);
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
  habilitarPixelado: {
    type: "boolean",
    default: false,
    editable: true,
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
