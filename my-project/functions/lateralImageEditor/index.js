// Lateral Image Editor ©
// v0.0.1
// @matbutom @montoyamoraga

// manual de uso

// parámetros que vamos a usar
// cargar imagen

// colores
// primario y secundario

// efecto mezclar colores

// efecto halftone
// columnas para el efecto (densidad)
// uso de círculos y cuadrados

// efecto pixelado
// columnas para el efecto (densidad)

// efecto threshold
// umbral del efecto

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
    habilitarHalftone,
    columnasHalftone,
    usarCirculos,
    usarCuadrados,
    habilitarPixelado,
    columnasDePixeles,
    nivelThreshold,
    habilitarThreshold,
  } = inputs;

  // variables de los efectos aplicados a las imagenes
  let img;
  let imgGraphic;
  let imgHalftone;
  let imgPixelada;
  let imgThreshold;

  // funcion para cargar imagen y filtros
  const cargarImagenYFiltro = () => {
    imgGraphic = sketch.createGraphics(img.width, img.height);
    imgGraphic.image(img, 0, 0);

    // variable para aplicar el efecto de blend colors
    if (habilitarBlend) {
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

    // variable para aplicar efecto Halftone
    imgHalftone = sketch.createGraphics(img.width, img.height);
    imgHalftone.image(img, 0, 0);

    if (habilitarHalftone) {
      imgHalftone.fill(colorPrimario);
      imgHalftone.rect(0, 0, img.width, img.height);

      // cálculos base adaptados de
      // https://tabreturn.github.io/code/processing/python/2019/02/09/processing.py_in_ten_lessons-6.3-_halftones.html
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

        // variable para aplicar efecto de circulos o cuadrados
        // NEXT: proxima version, podemos limpiar la logica de estos booleans
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

    imgPixelada = sketch.createGraphics(img.width, img.height);
    imgPixelada.image(img, 0, 0);

    // variable para efecto de pixelado threshold
    const threshold = 80;

    if (habilitarPixelado) {
      imgPixelada.fill(colorPrimario);
      imgGraphic.filter(imgGraphic.GRAY);
      imgPixelada.noStroke();
      imgPixelada.rect(0, 0, img.width, img.height);

      // mismos calculos base de efecto halftone
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
        // calculo para llevar pixeles grises a blanco y negro respectivamente
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

    imgThreshold = sketch.createGraphics(img.width, img.height);
    imgThreshold.image(img, 0, 0);

    // variable para efecto threshold
    if (habilitarThreshold) {
      imgThreshold.filter(imgThreshold.THRESHOLD, nivelThreshold);
      imgThreshold.blendMode(imgGraphic.BLEND);
      imgThreshold.fill(colorPrimario);
      imgGraphic.noStroke();
      imgGraphic.rect(0, 0, img.width, img.height);
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

    // activar efectos
    // halftone
    // pixelado
    // threshold

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
      img = sketch.loadImage(URL.createObjectURL(imagen));
    } else {
      img = sketch.loadImage("static/featured.jpg");
    }
  };

  sketch.setup = () => {
    sketch.createCanvas(ancho, altura);
    if (img) {
      cargarImagenYFiltro();
    }
  };

  sketch.draw = () => {
    definirEstiloBase();

    if (img) {
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
  habilitarHalftone: {
    type: "boolean",
    default: false,
    editable: true,
    label: "BITMAP - habilitar",
  },
  columnasHalftone: {
    type: "number",
    min: 10.0,
    max: 300.0,
    step: 1.0,
    slider: true,
    default: 100.0,
    label: "BITMAP - columnas"
  },
  usarCirculos: {
    type: "boolean",
    default: true,
    editable: true,
    label: "BITMAP - usar círculos"
  },
  usarCuadrados: {
    type: "boolean",
    default: false,
    editable: true,
    label: "BITMAP - usar cuadrados"
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
