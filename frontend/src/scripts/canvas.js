import { desenhaPixel, TAMANHO_PIXEL } from "./utils.js";
import { enviarPixel } from "./websocket.js";

const menuCor = document.getElementById("colorPicker");
const canvas = document.getElementById("canvas");
export const tela = canvas.getContext("2d");

let pintando = false;

// Inicializa o canvas
export const iniciarCanvas = () => {
  // Desenha o grid
  canvas.addEventListener("mousedown", (mouse) => {
    pintando = true;
    pintar(mouse);
  });

  canvas.addEventListener("mousemove", (mouse) => {
    if (pintando) pintar(mouse);
  });

  canvas.addEventListener("mouseup", () => {
    pintando = false;
  });

  canvas.addEventListener("mouseout", () => {
    pintando = false;
  });
};

export const pintar = (mouse) => {
  // Coordenadas do pixel
  const dimensoes = canvas.getBoundingClientRect();
  const x = Math.floor((mouse.clientX - dimensoes.left) / TAMANHO_PIXEL);
  const y = Math.floor((mouse.clientY - dimensoes.top) / TAMANHO_PIXEL);

  // Cor selecionada
  const color = menuCor.value;

  // Envia a atualização do pixel para o backend
  enviarPixel(x, y, color);

  // Atualiza o pixel localmente para atualizar sem delay
  desenhaPixel(tela, x, y, color);
};
