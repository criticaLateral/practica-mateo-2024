export const handler = ({ inputs, mechanic, sketch }) => {
  const { ancho, altura, imagen, color, nivelThreshold, habilitarThreshold } =
    inputs;

  const rows = 32;
  const separation = altura / rows;
  const availableRows = Array.from({ length: rows }, (_, k) => k);

  let img;
  let imgGraphic;
  let imgThreshold;

  const loadImageAndAddFilter = () => {

    // crear graphics del mismo tamano que la imagen
    imgGraphic = sketch.createGraphics(img.width, img.height);
    imgThreshold = sketch.createGraphics(img.width, img.height);

    // cargar la imagen en graphics
    imgGraphic.image(img, 0, 0);
    imgThreshold.image(img, 0, 0);


    if (habilitarThreshold) {
      // imgThreshold.filter(imgThreshold.THRESHOLD, nivelThreshold);
      imgThreshold.filter(imgThreshold.THRESHOLD, nivelThreshold);
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
    if (habilitarThreshold) {
      sketch.image(imgThreshold, x, y, scaledWidth, scaledHeight);
    } else {
      sketch.image(imgGraphic, x, y, scaledWidth, scaledHeight);
    }
    
  };

  const setStylingBase = () => {
    sketch.background("white");
    sketch.stroke(color);
    sketch.fill(color);
  };

  sketch.preload = () => {
    if (imagen) {
      img = sketch.loadImage(URL.createObjectURL(imagen));
    } else {
      img = sketch.loadImage("static/imagenDePrueba.png");
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

    if (img)  {
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
    editable: true
  },
  altura: {
    type: "number",
    default: 600,
    editable: true
  },
  color: {
    type: "color",
    default: "#39ff14",
    model: "hex"
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
   
};

export const presets = {
  vertical: {
    ancho: 1080,
    altura: 1920  
  },
  horizontal: {
    ancho: 1920,
    altura: 1080
  },
  cuadrado: {
    ancho: 1920,
    altura: 1920
  },
};

export const settings = {
  engine: require("@mechanic-design/engine-p5")
};