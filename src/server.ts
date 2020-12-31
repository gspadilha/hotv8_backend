import cors from 'cors';
import express, { Request, Response } from 'express';

import 'dotenv/config';
import buscarCarros from './crawler';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/carros-venda', async (request: Request, response: Response) => {
  const dados = await buscarCarros('carros-a-venda');
  return response.send(dados);
});

const port = process.env.APP_PORT || 3333;
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(
    `API ${process.env.API_NAME} iniciada em ${process.env.API_HOST}:${port}!`,
  );
});
