// 放入app.js
// const swaggerApp = require('./routes/swagger');
// app.use(swaggerApp);
//swagger.js本身要放在routes資料夾下


const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const express = require('express');
const app = express();

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Express API for Week 4 Sample Project',
    version: '1.0.0',
    description: 'This is a REST API application made with Express.',
  },
  servers: [
    {
      url: 'http://localhost:3000',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'], // 指定 API 定義的檔案路徑
};

const swaggerSpec = swaggerJSDoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = app;