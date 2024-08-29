export const handler = ({ inputs, mechanic, sketch }) => {
  const {
    ancho,
    altura,
    imagen,
    color,
    colorSecundario,
    colorPrimario,
    habilitarColores,
  } = inputs;

  const rows = 32;
  const separation = altura / rows;
  const availableRows = Array.from({ length: rows }, (_, k) => k);

  let img;
  let imgGraphic;

  const loadImageAndAddFilter = () => {
    imgGraphic = sketch.createGraphics(img.width, img.height);
    imgGraphic.image(img, 0, 0);

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
  };

  const putImageOnCanvas = () => {
    // Calcular la relación de aspecto de la imagen
    const imageAspectRatio = imgGraphic.width / imgGraphic.height;

    // Dimensiones máximas del canvas
    const maxWidth = window.innerWidth;
    const maxHeight = window.innerHeight;

    // Calcular las nuevas dimensiones del canvas
    let newWidth, newHeight;
    if (imageAspectRatio > maxWidth / maxHeight) {
      // La imagen es más ancha
      newWidth = maxWidth;
      newHeight = maxWidth / imageAspectRatio;
    } else {
      // La imagen es más alta
      newHeight = maxHeight;
      newWidth = maxHeight * imageAspectRatio;
    }

    // Ajustar el tamaño del canvas
    sketch.resizeCanvas(newWidth, newHeight);

    // Calcular el tamaño escalado de la imagen para que quepa en el canvas
    let scaledWidth = newWidth;
    let scaledHeight = newHeight;

    // Ajustar el tamaño para imágenes cuadradas y evitar cortes
    if (imgGraphic.width === imgGraphic.height) {
      // Si la imagen es cuadrada, ajustamos al tamaño más pequeño del canvas
      scaledWidth = Math.min(newWidth, newHeight);
      scaledHeight = scaledWidth;
    } else {
      // Para imágenes no cuadradas, evitamos que se corte
      if (imgGraphic.width > newWidth) {
        scaledWidth = imgGraphic.width;
      }
      if (imgGraphic.height > newHeight) {
        scaledHeight = imgGraphic.height;
      }
    }

    // Centrar la imagen en el canvas
    const x = (newWidth - scaledWidth) / 2;
    const y = (newHeight - scaledHeight) / 2;

    // dibujar la imagen en el canvas
    sketch.image(imgGraphic, x, y, scaledWidth, scaledHeight);
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
  habilitarColores: {
    type: "boolean",
    default: false,
    editable: true,
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
};
