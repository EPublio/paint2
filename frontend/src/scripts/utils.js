const TAMANHO_GRID = 64;
export const TAMANHO_PIXEL = canvas.width / TAMANHO_GRID;

export const desenhaPixel = (tela, x, y, color) => {
  if (x < 0 || x >= TAMANHO_GRID || y < 0 || y >= TAMANHO_GRID) return;

  tela.fillStyle = color;
  tela.fillRect(
    x * TAMANHO_PIXEL,
    y * TAMANHO_PIXEL,
    TAMANHO_PIXEL,
    TAMANHO_PIXEL
  );
};
