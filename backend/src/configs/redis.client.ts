import { createClient } from 'redis';

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  throw new Error('Variável de ambiente REDIS_URL não definida.');
}

const redisClient = createClient({
  url: redisUrl,
});

redisClient.on('error', (err) => console.log('Erro na Conexão com o Redis:', err));

redisClient.connect();

export default redisClient;