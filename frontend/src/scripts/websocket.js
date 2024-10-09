import { desenhaPixel } from "./utils.js";
import { tela } from "./canvas.js";

const socketUrl = "ws://localhost:6767";
let socket;

const conectarWebSocket = () => {
  socket = new WebSocket(socketUrl);

  socket.onopen = () => {
    console.log("Conexão realizada com sucesso!");
    tela.clearRect(0, 0, tela.canvas.width, tela.canvas.height);
    socket.send(JSON.stringify({ action: "get_canvas" }));
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log("Recebeu:", data);

    if (data.canvas) {
      data.canvas.forEach((row, y) => {
        row.forEach((c, x) => {
          if (c) desenhaPixel(tela, x, y, c);
        });
      });
    } else {
      const { x, y, c } = data;
      desenhaPixel(tela, x, y, c);
    }

    if (data.action === "clear_canvas") {
      tela.clearRect(0, 0, tela.canvas.width, tela.canvas.height);
    }
  };

  socket.onclose = () => {
    console.log("Desconectado do servidor WebSocket. Tentando reconectar...");
  };

  socket.onerror = (error) => {
    console.error("Erro no WebSocket:", error);
    socket.close();
  };
};

export const iniciarWebSocket = () => {
  conectarWebSocket();
};

export const enviarPixel = (x, y, color) => {
  if (verificaConexao()) {
    // Verifica se o WebSocket está aberto
    socket.send(
      JSON.stringify({
        action: "update_pixel",
        x,
        y,
        c: color,
      })
    );
  }
};

const verificaConexao = () => {
  if (socket.readyState === WebSocket.OPEN) {
    return true;
  } else {
    console.log("WebSocket não está aberto. Estado atual:", socket.readyState);
    return false;
  }
};

export const limpaCanvas = () => {
  tela.clearRect(0, 0, tela.canvas.width, tela.canvas.height);

  if (verificaConexao()) {
    socket.send(JSON.stringify({ action: "clear_canvas" }));
  }
};
