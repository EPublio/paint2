# pip install -r requirements.txt

import asyncio
import websockets
import json

from logs import Logger

logger = Logger('server.py')

GRID_SIZE = 64

# Inicializa o grid de pixels como uma variável global em memória.
canvas_grid = [[None for _ in range(GRID_SIZE)] for _ in range(GRID_SIZE)]

# set de clientes conectados
connected_clients = set()

async def update_pixel(data):
    x, y, color = data['x'], data['y'], data['c']
    
    # Atualiza o pixel no grid do server
    try:
        canvas_grid[x][y] = color

         # Envia a atualização para todos os clientes conectados
        update = {"x": x, "y": y, "c": color}
        await broadcast(update)

    except IndexError:
        # Erro que ocorre quando arrasta pra direita ou pra baixo, ou seja, x ou y são maiores que o grid size
        # logger.infoa a mensagem bonitinha só pra não explodir um erro gigantesco
        logger.info(f"Índices inválidos: {x}, {y}")
   

async def clear_canvas():
    # Limpa o canvas
    global canvas_grid
    canvas_grid = [[None for _ in range(GRID_SIZE)] for _ in range(GRID_SIZE)]

    # Envia a limpeza para todos os clientes conectados
    await broadcast({"action": "clear_canvas"})

async def broadcast(message):
    # Envia uma mensagem para todos os clientes conectados
    if connected_clients:
        message_data = json.dumps(message)
        
        # Filtra clientes válidos que ainda estão conectados
        # Trata os envios como tasks por que deu erro da outra forma e tive que fazer assincrono
        tasks = []
        for client in connected_clients:
            try:
                tasks.append(client.send(message_data))
            except Exception as e:
                logger.info(f"Erro ao enviar para um cliente: {e}")
        
        # Aguarda as tarefas apenas para clientes válidos de forma assincrona
        if tasks:
            await asyncio.gather(*tasks)

async def handler(websocket, path):
    # Adiciona o novo cliente à lista de conectados
    connected_clients.add(websocket)
    logger.info(f'Novo cliente conectado {websocket}')

    try:
        # Envia o estado atual do canvas para o cliente ao conectar
        await websocket.send(json.dumps({"canvas": rotate_canvas(canvas_grid)}))

        async for message in websocket:
            data = json.loads(message)

            # Verifica se o comando é para atualizar o pixel
            if data['action'] == 'update_pixel':
                await update_pixel(data)

            # Verifica se o comando é para limpar o canvas
            elif data['action'] == 'clear_canvas':
                await clear_canvas()

    except Exception as e:
        logger.info(f"Erro ao receber informações {e}")
    finally:
        # Remove o cliente quando ele se desconecta.
        logger.info(f'Cliente desconectado {websocket}')
        connected_clients.remove(websocket)

def rotate_canvas(canvas):
    # gambiarra sinistra para rotacionar o canvas
    # pensei agora que devo estar enviando x e y invertidos pelo front mas não vou arrumar agora, ja ta tarde
    x = list(map(list, zip(*canvas[::-1])))
    for i in x:
        i.reverse()
    return x

async def main():
    # Inicia o servidor WebSocket na porta 6767
    async with websockets.serve(handler, "0.0.0.0", 6767):
        logger.info("Servidor WebSocket iniciado no: 0.0.0.0:6767")
        await asyncio.Future()  # Mantém o servidor em execução


# Coloca a carroça pra andar
try:
    print("Iniciando servidor...")
    logger.info("Iniciando servidor...")
    asyncio.run(main())
except KeyboardInterrupt:
    print("Servidor encerrado")
    logger.info("Servidor encerrado")
except Exception as e:
    print(f"Erro ao iniciar servidor: {e}")
    logger.info(f"Erro ao iniciar servidor: {e}")

