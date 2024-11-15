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
      // aplica el filtro de umbral a la imagen
      // el valor "nivelUmbral" determina el nivel de umbral con un slider
      imgGraphic.filter(imgGraphic.THRESHOLD, nivelThreshold);
      imgGraphic.loadPixels();

      // obtiene los valores de rojo, verde y azul del color primario
      let rojoPrimario = imgGraphic.red(colorPrimario);
      let verdePrimario = imgGraphic.green(colorPrimario);
      let azulPrimario = imgGraphic.blue(colorPrimario);

      // itera a través de cada píxel de la imagen (saltando el canal alfa)
      for (let i = 0; i < imgGraphic.pixels.length; i = i + 4) {
        let brillo =
          (imgGraphic.pixels[i + 0] +
            imgGraphic.pixels[i + 1] +
            imgGraphic.pixels[i + 2]) /
          3;

        // aplica el efecto de umbral a cada canal de color basado en el brillo
        // multiplica el brillo por el valor del color primario para teñir la imagen

        // rojo
        imgGraphic.pixels[i + 0] = (brillo / 255) * rojoPrimario;
        // azul
        imgGraphic.pixels[i + 1] = (brillo / 255) * verdePrimario;
        // verde
        imgGraphic.pixels[i + 2] = (brillo / 255) * azulPrimario;
        // establece el canal alfa (transparencia) a completamente opaco (255)
        imgGraphic.pixels[i + 3] = 255;
      }

      imgGraphic.updatePixels();
    }

    // efecto2: bitmap

    if (habilitarBitmap) {
      // cálculos base adaptados de
      // https://tabreturn.github.io/code/processing/python/2019/02/09/processing.py_in_ten_lessons-6.3-_halftones.html

      // numero total de columnas en el mapa de bits
      let colTotal = columnasBitmap;
      // Tamaño de cada celda en el mapa de bits (basado en el ancho de la imagen original)
      let cellSize = imgOriginal.width / colTotal;
      // numero total de filas en el mapa de bits (redondeado basado en el tamaño de celda)
      let rowTotal = Math.round(imgOriginal.height / cellSize);
      // indice de columna y fila actuales (para iterar a través de las celdas)
      let col = 0;
      let row = 0;
      // bucle que recorre cada celda en la cuadrícula del mapa de bits (total de columnas * filas)
      for (let i = 0; i < colTotal * rowTotal; i++) {
        let x = col * cellSize;
        let y = row * cellSize;
        // pasamos a la siguiente columna después de calcular las coordenadas
        col = col + 1;
        // verificamos si necesitamos pasar a la siguiente fila
        if (col >= colTotal) {
          col = 0;
          row = row + 1;
        }
        x = x + cellSize / 2;
        y = y + cellSize / 2;
        let colorPixel = imgGraphic.get(x, y);

        imgGraphic.noStroke();
        imgGraphic.fill(colorPixel);
        imgGraphic.rect(x - cellSize / 2, y - cellSize / 2, cellSize, cellSize);
      }
    }

    // efecto3 pixelado

    // variable para efecto de pixelado threshold
    let umbralPixelado = 255.0 / 2.0;

    if (habilitarPixelado) {
      // obtiene los valores rojo, verde y azul del color primario
      let primarioR = imgGraphic.red(colorPrimario);
      let primarioG = imgGraphic.green(colorPrimario);
      let primarioB = imgGraphic.blue(colorPrimario);

      // obtiene los valores rojo, verde y azul del color secundario
      let secundarioR = imgGraphic.red(colorSecundario);
      let secundarioG = imgGraphic.green(colorSecundario);
      let secundarioB = imgGraphic.blue(colorSecundario);

      imgGraphic.filter(imgGraphic.GRAY);

      // numero total de columnas en la cuadrícula pixelada
      let colTotal = imgOriginal.width / resolucionPixelado;
      let rowTotal = Math.round(imgOriginal.height / resolucionPixelado);
      let col = 0;
      let row = 0;

      // bucle que recorre cada cuadro en la cuadrícula pixelada (total de columnas * filas)
      for (let i = 0; i < colTotal * rowTotal; i++) {
        // calcula las coordenadas x e y del centro del cuadro actual
        let x = col * resolucionPixelado;
        let y = row * resolucionPixelado;
        // pasamos a la siguiente columna después de calcular las coordenadas
        col = col + 1;

        // verificamos si necesitamos pasar a la siguiente fila
        if (col >= colTotal) {
          col = 0;
          row = row + 1;
        }
        x = x + resolucionPixelado / 2;
        y = y + resolucionPixelado / 2;
        // obtenemos el valor de color del píxel en las coordenadas calculadas
        let colorPixel = imgGraphic.get(x, y);
        // calcula el brillo promedio del píxel (rojo, verde y azul)
        let brillo =
          (imgGraphic.red(colorPixel) +
            imgGraphic.green(colorPixel) +
            imgGraphic.blue(colorPixel)) /
          3.0;

        imgGraphic.noStroke();
        // elige el color de relleno según el brillo
        if (brillo < umbralPixelado) {
          // si el brillo es menor al umbral, se usa el color secundario
          imgGraphic.fill(secundarioR, secundarioG, secundarioB);
        } else {
          // si el brillo es mayor o igual al umbral, se usa el color primario
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
    // calculamos la relacion de aspecto de la imagen
    const imageAspectRatio = imgGraphic.width / imgGraphic.height;
    // obtenemos el ancho y alto maximo de la ventana
    const maxWidth = window.innerWidth;
    const maxHeight = window.innerHeight;
    // calculamos el nuevo ancho y alto para que la imagen quepa en la ventana
    let newWidth, newHeight;
    if (imageAspectRatio > maxWidth / maxHeight) {
      // si la imagen es mas ancha que alta, ajustamos el ancho al maximo y calculamos el alto
      newWidth = maxWidth;
      newHeight = maxWidth / imageAspectRatio;
    } else {
      // si la imagen es mas alta que ancha, ajustamos el alto al maximo y calculamos el ancho
      newHeight = maxHeight;
      newWidth = maxHeight * imageAspectRatio;
    }
    // redimensionamos el canvas al nuevo ancho y alto
    sketch.resizeCanvas(newWidth, newHeight);
    // calculamos el ancho y alto escalados para la imagen
    let scaledWidth = newWidth;
    let scaledHeight = newHeight;

    // escalamos el canvas dependiendo del tamaño de la imagen
    // canvas responsivo a imagen

    if (imgGraphic.width === imgGraphic.height) {
      // si la imagen es cuadrada, usamos el menor de los dos valores para el ancho y alto escalados
      scaledWidth = Math.min(newWidth, newHeight);
      scaledHeight = scaledWidth;
    } else {
      // si la imagen no es cuadrada, escalamos solo si es necesario para que quepa en el canvas
      if (imgGraphic.width > newWidth) {
        scaledWidth = imgGraphic.width;
      }
      if (imgGraphic.height > newHeight) {
        scaledHeight = imgGraphic.height;
      }
    }
    // calculamos la posicion x e y para centrar la imagen en el canvas
    const x = (newWidth - scaledWidth) / 2;
    const y = (newHeight - scaledHeight) / 2;

    // renderizamos imagen
    sketch.image(imgGraphic, x, y, scaledWidth, scaledHeight);
  };

  // definimos el estilo base del canvas
  const definirEstiloBase = () => {
    // establecemos el fondo blanco
    sketch.background("white");
    // establecemos el color del borde al color primario
    sketch.stroke(colorPrimario);
    // establecemos el color de relleno al color primario
    sketch.fill(colorPrimario);
  };
  // cargamos la imagen antes de que el sketch comience
  sketch.preload = () => {
    if (imagen) {
      // si hay una imagen seleccionada, la cargamos desde la url
      imgOriginal = sketch.loadImage(URL.createObjectURL(imagen));
    } else {
      // si no hay imagen seleccionada, cargamos una imagen por defecto
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

// inputs reflejados en la barra lateral
export const inputs = {
  imagen: {
    type: "image",
    label: "GENERAL - cargar imagen",
  },
  colorPrimario: {
    type: "color",
    default: "#39ff14",
    model: "hex",
    label: "GENERAL - color primario",
  },
  colorSecundario: {
    type: "color",
    default: "#DE3163",
    model: "hex",
    label: "GENERAL - color secundario",
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
    label: "BITMAP - columnas",
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
