<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Canvas teste</title>
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    <div id="container">
      <h1>Paint(ruim) online</h1>
      <canvas id="canvas" width="512" height="512"></canvas>
      <input type="color" id="colorPicker" value="#000000" />
      <br>
      <button id="clearButton">Limpar</button>
    </div>
    <script type="module" src="./scripts/app.js"></script>
    <script type="module" src="./scripts/adm.js"></script>
  </body>
</html>
