import { limpaCanvas } from "./websocket.js";

const limpar = document.getElementById("clearButton");

limpar.addEventListener("click", () => {
  limpaCanvas();
});
