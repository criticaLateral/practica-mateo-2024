export const handler = ({ inputs, mechanic, sketch }) => {
  const { ancho, altura, imagen, color, habilitarThreshold, nivelUmbral, habilitarHalftone, columnasHalftone} = inputs;

  let img;
  let imgGraphic;
  let imgHalftone;

  const loadImageAndAddFilter = () => {

    imgGraphic = sketch.createGraphics(img.width, img.height);
    imgHalftone = sketch.createGraphics(img.width, img.height);
  
    if (habilitarThreshold) {
      imgGraphic.push();
      imgGraphic.filter(imgGraphic.THRESHOLD, nivelUmbral);
      imgGraphic.blendMode(imgGraphic.MULTIPLY);
      imgGraphic.noStroke();
      imgGraphic.fill(color);
      imgGraphic.rect(0, 0, img.width, img.height);
      imgGraphic.blendMode(imgGraphic.BLEND);   
      imgGraphic.pop();
    }

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
        x = (x + cellSize / 2);
        y = (y + cellSize / 2);
        let colorPixel = imgGraphic.get(x, y);
        let brillo = imgGraphic.brightness(colorPixel);
        let amplitud = 10 * brillo / 200.0;
        imgHalftone.noStroke();
        imgHalftone.fill(255);
        imgHalftone.ellipse(x, y, amplitud, amplitud);
      }
    }
  };

  const putImageOnCanvas = () => {
  
    // calcular la relación de aspecto de la imagen
    const imageAspectRatio = imgGraphic.width / imgGraphic.height;

    // dimensiones maximas del canvas 
    const maxWidth = window.innerWidth;
    const maxHeight = window.innerHeight;

    // calcular las nuevas dimensiones del canvas
    let newWidth, newHeight;
    if (imageAspectRatio > maxWidth / maxHeight) {
      // si la imagen es mas ancha
      newWidth = maxWidth;
      newHeight = maxWidth / imageAspectRatio;
    } else {
      // si la imagen es mas alta
      newHeight = maxHeight;
      newWidth = maxHeight * imageAspectRatio;
    }

    // ajustar el tamano del canvas
    sketch.resizeCanvas(newWidth, newHeight);

    // calcular el tamano escalado de la imagen para que quepa en el canvas
    let scaledWidth = newWidth;
    let scaledHeight = newHeight;

    // ajustar el tamano para imagenes cuadradas y evitar cortes
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

    if (habilitarHalftone) {
      sketch.image(imgHalftone, x, y, scaledWidth, scaledHeight);
    } else if (habilitarThreshold) {
      sketch.image(imgGraphic, x, y, scaledWidth, scaledHeight);
    } else {
      sketch.image(img, x, y, scaledWidth, scaledHeight); // Draw original image if neither effect is enabled
    }

    // dibujar la imagen en el canvas
    if (habilitarHalftone) {
      sketch.image(imgHalftone, x, y, scaledWidth, scaledHeight);
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
    };

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
   nivelUmbral: { 
    type: "number", 
    min: 0.0, 
    max: 1.0, 
    step: 0.01, 
    slider: true, 
    default: 0.5 
   },
   habilitarHalftone: {
    type: "boolean",
    default: false,
    editable: true
  },
  columnasHalftone: {
    type: "number", 
    min: 10.0, 
    max: 300.0, 
    step: 1.00, 
    slider: true, 
    default: 100.0
  }
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
  engine: require("@mechanic-design/engine-p5"),
};