import swaggerJsdoc, { type Options } from 'swagger-jsdoc';

const swaggerOptions: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Documentação UaiFood',
      version: '1.0.0',
      description: 'API documentada da aplicação Uaifood usando Swagger e TypeScript',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./src/routes/*.ts'], // Define onde os endpoints estão descritos
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

export default swaggerDocs;