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
    columnasDePixeles,
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

        // variable para efecto de pixelado threshold
        const threshold = 80;

 

    // variable para efecto threshold
    if (habilitarThreshold) {
      imgGraphic.filter(imgGraphic.THRESHOLD, nivelThreshold);
      imgGraphic.blendMode(imgGraphic.BLEND);
      imgGraphic.fill(colorPrimario);
    }


        // efecto2: bitmap


    if (habilitarBitmap) {
      // imgGraphic.fill(colorPrimario);
      //imgGraphic.rect(0, 0, imgOriginal.width, imgOriginal.height);

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

    imgPixelada = sketch.createGraphics(imgOriginal.width, imgOriginal.height);
    imgPixelada.image(imgOriginal, 0, 0);

    if (habilitarPixelado) {
      imgPixelada.fill(colorPrimario);
      imgGraphic.filter(imgGraphic.GRAY);
      imgPixelada.noStroke();
      imgPixelada.rect(0, 0, imgOriginal.width, imgOriginal.height);

      // mismos calculos base de efecto bitmap
      let colTotal = columnasDePixeles;
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
        // calculo para llevar pixeles grises a blanco y negro respectivamente
        const pixelSize = columnasDePixeles;
        for (let y = 0; y < imgOriginal.height; y += pixelSize) {
          for (let x = 0; x < imgOriginal.width; x += pixelSize) {
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
  columnasDePixeles: {
    type: "number",
    min: 1.0,
    max: 10.0,
    step: 1.0,
    slider: true,
    default: 3.0,
    label: "PIXELADO - columnas",
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
