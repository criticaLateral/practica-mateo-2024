// Lateral Image Editor ©
// v0.0.1
// @matbutom @montoyamoraga

// manual de uso

// parámetros que vamos a usar
// cargar imagen

// colores
// primario y secundario

// hay 4 filtros
// los ordenamos de mas sutil a mas extremo
// la imagen pasa por estos 4 filtros en orden
// y luego es mostrada

// efecto0: blend

// efecto1: threshold
// umbral del efecto

// efecto2: bitmap
// columnas para el efecto (densidad)
// uso de círculos y cuadrados

// efecto3 pixelado
// columnas para el efecto (densidad)

// handler recibe un argumento específico que puede
// producir distintas variables de diseno basado
// en el valor de este argumento

export const handler = ({ inputs, mechanic, sketch }) => {
  const {
    ancho,
    altura,
    imagen,
    colorPrimario,
    colorSecundario,
    habilitarBlend,
    habilitarBitmap,
    columnasBitmap,
    habilitarPixelado,
    resolucionPixelado,
    nivelThreshold,
    habilitarThreshold,
  } = inputs;

  // variables de los efectos aplicados a las imagenes
  let imgOriginal;
  let imgGraphic;
  let imgPixelada;
  let imgThreshold;

  // funcion para cargar imagen y filtros
  const cargarImagenYFiltro = () => {

    // crear un imgGraphic tan grande como el original
    imgGraphic = sketch.createGraphics(imgOriginal.width, imgOriginal.height);
    imgGraphic.image(imgOriginal, 0, 0);

  // efecto0: blend

    // variable para aplicar el efecto de blend colors
    if (habilitarBlend) {
      // capa para el color secundario
      imgGraphic.filter(imgGraphic.GRAY);
      imgGraphic.blendMode(imgGraphic.SCREEN);
      imgGraphic.fill(colorSecundario);
      imgGraphic.noStroke();
      imgGraphic.rect(0, 0, imgOriginal.width, imgOriginal.height);

      // capa para color primario
      imgGraphic.blendMode(imgGraphic.SCREEN);
      imgGraphic.blendMode(imgGraphic.OVERLAY);
      imgGraphic.fill(colorPrimario);
      imgGraphic.noStroke();
      imgGraphic.rect(0, 0, imgOriginal.width, imgOriginal.height);
    }

    // efecto1: threshold


    // variable para efecto threshold
    if (habilitarThreshold) {
      imgGraphic.filter(imgGraphic.THRESHOLD, nivelThreshold);

      imgGraphic.loadPixels();

      let rojoPrimario = imgGraphic.red(colorPrimario);
      let verdePrimario = imgGraphic.green(colorPrimario);
      let azulPrimario = imgGraphic.blue(colorPrimario);

      for (let i = 0; i < imgGraphic.pixels.length; i = i + 4) {

       let brillo = (imgGraphic.pixels[i + 0] + imgGraphic.pixels[i + 1] + imgGraphic.pixels[i + 2]) / 3;

        // rojo
        imgGraphic.pixels[i + 0] = (brillo / 255) *  rojoPrimario;
        // azul
        imgGraphic.pixels[i + 1] = (brillo / 255) * verdePrimario;
        // verde
        imgGraphic.pixels[i + 2] = (brillo / 255) * azulPrimario;
        // transparencia
        imgGraphic.pixels[i + 3] = 255;
      }

      imgGraphic.updatePixels();
    }


        // efecto2: bitmap


    if (habilitarBitmap) {
      // cálculos base adaptados de
      // https://tabreturn.github.io/code/processing/python/2019/02/09/processing.py_in_ten_lessons-6.3-_halftones.html
      let colTotal = columnasBitmap;
      let cellSize = imgOriginal.width / colTotal;
      let rowTotal = Math.round(imgOriginal.height / cellSize);
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
        // variable para aplicar efecto de circulos o cuadrados
        // NEXT: proxima version, podemos limpiar la logica de estos booleans

          imgGraphic.noStroke();
          imgGraphic.fill(colorPixel);
          imgGraphic.rect(
            x - cellSize / 2,
            y - cellSize / 2,
            cellSize,
            cellSize
          );
        
      }
    }

    // efecto3 pixelado

    // variable para efecto de pixelado threshold
    let umbralPixelado = 255.0/2.0;

    if (habilitarPixelado) {

      let primarioR = imgGraphic.red(colorPrimario);
      let primarioG = imgGraphic.green(colorPrimario);
      let primarioB = imgGraphic.blue(colorPrimario);

      let secundarioR = imgGraphic.red(colorSecundario);
      let secundarioG = imgGraphic.green(colorSecundario);
      let secundarioB = imgGraphic.blue(colorSecundario);

      imgGraphic.filter(imgGraphic.GRAY);

      let colTotal = imgOriginal.width / resolucionPixelado;
      let rowTotal = Math.round(imgOriginal.height / resolucionPixelado);
      let col = 0;
      let row = 0;
      for (let i = 0; i < colTotal * rowTotal; i++) {
        let x = col * resolucionPixelado;
        let y = row * resolucionPixelado;
        col = col + 1;

        if (col >= colTotal) {
          col = 0;
          row = row + 1;
        }
        x = x + resolucionPixelado / 2;
        y = y + resolucionPixelado / 2;
        let colorPixel = imgGraphic.get(x, y);

        let brillo = (imgGraphic.red(colorPixel) + imgGraphic.green(colorPixel) + imgGraphic.blue(colorPixel)) / 3.0;

        imgGraphic.noStroke();

        if (brillo < umbralPixelado) {
          imgGraphic.fill(secundarioR, secundarioG, secundarioB);
        }
        else {
          imgGraphic.fill(primarioR, primarioG, primarioB);
        }
          imgGraphic.rect(
            x - resolucionPixelado / 2,
            y - resolucionPixelado / 2,
            resolucionPixelado,
            resolucionPixelado
          );
        
      }
    }

  };

  // calculos para cargar imagen en el canvas
  const ponerImagenEnCanvas = () => {
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

    // escalamos el canvas dependiendo del tamaño de la imagen
    // canvas responsivo a imagen

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

    // renderizamos imagen

    sketch.image(imgGraphic, x, y, scaledWidth, scaledHeight);

  };

  // explicar que estas son las condiciones de inicio
  const definirEstiloBase = () => {
    // fondo blanco
    sketch.background("white");
    // borde con el color primario
    sketch.stroke(colorPrimario);
    // relleno con el color primario
    sketch.fill(colorPrimario);
  };

  sketch.preload = () => {
    if (imagen) {
      imgOriginal = sketch.loadImage(URL.createObjectURL(imagen));
    } else {
      imgOriginal = sketch.loadImage("static/featured.jpg");
    }
  };

  sketch.setup = () => {
    sketch.createCanvas(ancho, altura);
    if (imgOriginal) {
      cargarImagenYFiltro();
    }
  };

  sketch.draw = () => {
    definirEstiloBase();

    if (imgOriginal) {
      ponerImagenEnCanvas();
    }

    mechanic.done();
  };
};

export const inputs = {
  imagen: {
    type: "image",
    label: "GENERAL - cargar imagen"
  },
  colorPrimario: {
    type: "color",
    default: "#39ff14",
    model: "hex",
    label: "GENERAL - color primario"
  },
  colorSecundario: {
    type: "color",
    default: "#DE3163",
    model: "hex",
    label: "GENERAL - color secundario"
  },
  habilitarBlend: {
    type: "boolean",
    default: false,
    editable: true,
    label: "BLEND - habilitar",
  },
  habilitarThreshold: {
    type: "boolean",
    default: false,
    editable: true,
    label: "THRESHOLD - habilitar",
  },
  nivelThreshold: {
    type: "number",
    min: 0.0,
    max: 1.0,
    step: 0.01,
    slider: true,
    default: 0.5,
    label: "THRESHOLD - nivel",
  },
  habilitarBitmap: {
    type: "boolean",
    default: false,
    editable: true,
    label: "BITMAP - habilitar",
  },
  columnasBitmap: {
    type: "number",
    min: 10.0,
    max: 300.0,
    step: 1.0,
    slider: true,
    default: 100.0,
    label: "BITMAP - columnas"
  },

  habilitarPixelado: {
    type: "boolean",
    default: false,
    editable: true,
    label: "PIXELADO - habilitar",
  },
  resolucionPixelado: {
    type: "number",
    min: 2.0,
    max: 10.0,
    step: 1.0,
    slider: true,
    default: 3.0,
    label: "PIXELADO - resolucion",
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
  hideScaleToFit: true,
  hideGenerate: true,
  hidePresets: true,
};
