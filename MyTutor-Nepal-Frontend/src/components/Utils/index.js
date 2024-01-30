const getInitials = (name) => {
  const initial = name.substring(0, 1);
  return initial.toUpperCase();
};

export const createImageFromInitials = (name) => {
  if (name == null) return;
  name = getInitials(name);

  let size = 40;

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  canvas.width = canvas.height = size;

  context.fillStyle = "#000000";
  context.fillRect(0,0,size,size);

  context.fillStyle = "#ffffff";
  context.textBaseline = "middle";
  context.textAlign = "center";
  context.font = `15px "Jakarta Sans", sans-serif`;
  context.fillText(name, size/2, size/2);

  return canvas.toDataURL();
};
