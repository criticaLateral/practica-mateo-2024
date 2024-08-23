export const handler = ({ inputs, mechanic, sketch }) => {
  const { habilitarThreshold, nivelUmbral } = inputs;
};

export const inputs = {
 
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
};

export const presets = {
};

export const settings = {
  engine: require("@mechanic-design/engine-p5"),
};