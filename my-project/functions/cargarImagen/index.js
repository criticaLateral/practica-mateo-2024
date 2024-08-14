

export const handler = ({ inputs, mechanic, sketch }) => {
  const { width, height, image, color, nivelPosterize } =
    inputs;

  const rows = 32;
  const separation = height / rows;
  const availableRows = Array.from({ length: rows }, (_, k) => k);

  let img;
  let imgGraphic;

  const loadImageAndAddFilter = () => {
    imgGraphic = sketch.createGraphics(img.width, img.height);
    imgGraphic.image(img, 0, 0);
    imgGraphic.filter(imgGraphic.POSTERIZE, nivelPosterize);
    imgGraphic.blendMode(imgGraphic.MULTIPLY);
    imgGraphic.noStroke();
    imgGraphic.fill(color);
    imgGraphic.rect(0, 0, img.width, img.height);
    imgGraphic.blendMode(imgGraphic.BLEND);
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

    // Dibujar la imagen en el canvas
    sketch.image(imgGraphic, x, y, scaledWidth, scaledHeight);

  };

  const setStylingBase = () => {
    sketch.background("white");
    sketch.stroke(color);
    sketch.fill(color);
  };

  sketch.preload = () => {
    if (image) {
      img = sketch.loadImage(URL.createObjectURL(image));
    } else {
      img = sketch.loadImage("static/imagenDePrueba.png");
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
    type: "image",
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
  color: {
    type: "color",
    default: "#E94225",
    model: "hex"
  },
   nivelPosterize: { 
    type: "number", 
    min: 2, 
    max: 255, 
    step: 1, 
    slider: true, 
    default: 2 
   },
   
};

export const presets = {
  Vertical: {
    width: 1080,
    height: 1920  
  },
  Horizontal: {
    width: 1920,
    height: 1080
  },
  Cuadrado: {
    width: 1920,
    height: 1920
  },
};

export const settings = {
  engine: require("@mechanic-design/engine-p5")
};