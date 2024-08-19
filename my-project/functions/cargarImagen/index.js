export const handler = ({ inputs, mechanic, sketch }) => {
  const { width, height, image, color, nivelThreshold, halftoneEnabled, halftoneImg, halftoneImage } = inputs;

  let img;
  let imgGraphic;

  const loadImageAndAddFilter = () => {
    imgGraphic = sketch.createGraphics(img.width, img.height);
    imgGraphic.image(img, 0, 0);
    imgGraphic.filter(imgGraphic.THRESHOLD, nivelThreshold)
    imgGraphic.blendMode(imgGraphic.MULTIPLY);
    imgGraphic.noStroke();
    imgGraphic.fill(color);
    imgGraphic.rect(0, 0, img.width, img.height);
    imgGraphic.blendMode(imgGraphic.BLEND);
    
  };

  const putImageOnCanvas = () => {
  
    // calcular la relación de aspecto de la imagen
    const imageAspectRatio = imgGraphic.width / imgGraphic.height;

    // dimensiones máximas del canvas 
    const maxWidth = window.innerWidth;
    const maxHeight = window.innerHeight;

    // calcular las nuevas dimensiones del canvas
    let newWidth, newHeight;
    if (imageAspectRatio > maxWidth / maxHeight) {
      // si la imagen es más ancha
      newWidth = maxWidth;
      newHeight = maxWidth / imageAspectRatio;
    } else {
      // si la imagen es más alta
      newHeight = maxHeight;
      newWidth = maxHeight * imageAspectRatio;
    }

    // ajustar el tamaño del canvas
    sketch.resizeCanvas(newWidth, newHeight);

    // calcular el tamaño escalado de la imagen para que quepa en el canvas
    let scaledWidth = newWidth;
    let scaledHeight = newHeight;

    // ajustar el tamano para imágenes cuadradas y evitar cortes
    if (imgGraphic.width === imgGraphic.height) {
    // si la imagen es cuadrada, ajustamos al tamano más pequeño del canvas
      scaledWidth = Math.min(newWidth, newHeight);
      scaledHeight = scaledWidth;
    } else {
    // para imagenes no cuadradas, evitamos que se corte
      if (imgGraphic.width > newWidth) {
        scaledWidth = imgGraphic.width;
      }
      if (imgGraphic.height > newHeight) {
        scaledHeight = imgGraphic.height;
      }
    }

    // centrar la imagen en el canvas
    const x = (newWidth - scaledWidth) / 2;
    const y = (newHeight - scaledHeight) / 2;

    // dibujar la imagen en el canvas
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
      if (halftoneEnabled) {
        halftoneImg = halftoneImage(imgGraphic, {
          angle: 45,
          dotSize: 5,
          pattern: "circles",
          noise: 0.1,
          color: "black",
          opacity: 0.8
        });
      }
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
    };

    if (img) {
      if (halftoneEnabled) {
        sketch.image(halftoneImg, x, y, scaledWidth, scaledHeight);
      } else {
        sketch.image(img, x, y, scaledWidth, scaledHeight);
      };
    };

    sketch.loadImage();

    sketch.image(imgGraphic, x, y, scaledWidth, scaledHeight);

    drawRiso();

  };

    mechanic.done();
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
    default: "#39ff14",
    model: "hex"
  },
   nivelThreshold: { 
    type: "number", 
    min: 0.0, 
    max: 1.0, 
    step: 0.01, 
    slider: true, 
    default: 0.5 
   },
   halftoneEnabled: {
    type: "boolean",
    default: false,
    editable: true
  }
};

export const presets = {
  vertical: {
    width: 1080,
    height: 1920  
  },
  horizontal: {
    width: 1920,
    height: 1080
  },
  cuadrado: {
    width: 1920,
    height: 1920
  },
};

export const settings = {
  engine: require("@mechanic-design/engine-p5")
  
};