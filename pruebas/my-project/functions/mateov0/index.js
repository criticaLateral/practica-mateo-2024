export const handler = ({ inputs, mechanic, sketch }) => {
  const { width, height, myImage } = inputs;

  let img;
  let isImageLoaded = false;

  // definimos los tipos de archivos para poder subir
  // jpg, png, gif
  sketch.preload = () => {
    if (myImage && myImage.file) {
      const file = myImage.file;
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];

      if (allowedTypes.includes(file.type)) {
        img = sketch.loadImage(URL.createObjectURL(file), () => {
          isImageLoaded = true;
          console.log('Imagen cargada');
        });
      } else {
        console.error('El archivo seleccionado no es una imagen válida');
        // Mostrar un mensaje de error al usuario en la interfaz
        // Por ejemplo, utilizando un elemento HTML con id "error-message"
        document.getElementById('error-message').textContent = 'El archivo seleccionado no es una imagen válida.';
      }
    }
  };

  sketch.draw = () => {
    sketch.background(255);
    if (isImageLoaded) {
      sketch.image(img, (width - img.width) / 2, (height - img.height) / 2);
    } else {
      // Mostrar un mensaje de carga mientras se espera que la imagen se cargue
      sketch.text('Cargando imagen...', width/2, height/2);
    }
  };

  sketch.setup = () => {
    sketch.createCanvas(width.img, height.img);
  };

};

export const inputs = {
  myImage: { 
    type: "image" 
  },
  width: {
    type: "number",
    default: 400
  },
  height: {
    type: "number",
    default: 400
  },
  text: {
    type: "text",
    default: ""
  },
};

export const presets = {
  medium: {
    width: 800,
    height: 600
  },
  large: {
    width: 1600,
    height: 1200
  }
};

export const settings = {
  engine: require("@mechanic-design/engine-p5")
};
