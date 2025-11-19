import express, { type Express, type Request, type Response, type NextFunction } from 'express';
import 'express-async-errors';
import cors from 'cors';
import router from './routes/index.js';

import swaggerUI from 'swagger-ui-express';
import swaggerDocs from './configs/swaggerConfig.js';

const app: Express = express();

app.use(cors({
  origin: 'http://localhost:3000' 
}));
app.use(express.json());
app.use(router);

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

app.get('/', (req: Request, res: Response) => {
  res.send('Bem vindos a API do UaiFood!');
});

app.use((err: Error, request: Request, response: Response, next: NextFunction) => {
  if (err instanceof Error) {
    return response.status(400).json({
      message: err.message,
    });
  }

  return response.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
  });
});


export default app;