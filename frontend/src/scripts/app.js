import { iniciarCanvas } from "./canvas.js";
import { iniciarWebSocket } from "./websocket.js";

// Inicializa o canvas
iniciarCanvas();

// Configura o WebSocket e lida com as mensagens do servidor
iniciarWebSocket();
