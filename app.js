import express, { json } from 'express';
import logger from 'morgan';
import cors from 'cors';
import { readFileSync } from 'fs';
import contactsRouter from './routes/api/contacts-router.js';
import userRouter from './routes/api/auth-router.js';
import moviesRouter from './routes/api/movies-router.js';
import swaggerUi from 'swagger-ui-express';

const rawdata = readFileSync('./swagger.json');
const swaggerDocument = JSON.parse(rawdata);

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'REST API Documentation',
      version: '0.1.0',
      description:
        'This is a simple API application made with Expess and documented with Swagger',
      contact: {
        name: 'Maksym Borovichenko',
        url: 'https://github.com/MaksymBora/nodejs-homework-rest-api',
        email: 'maxboraod@gmail.com',
      },
    },
    servers: [
      {
        url: 'https://web4you.space/',
      },
      {
        url: 'http://localhost:3000/',
      },
    ],
  },
  apis: ['./routes/api/*.js'],
};

// const spacs = swaggerJsdoc(options);

app.use(logger(formatsLogger));
app.use(cors());
app.use(json());
app.use(express.static('public'));

app.use('/api/contacts', contactsRouter);
app.use('/users', userRouter);
app.use('/favorite', moviesRouter);

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((_, res) => {
  res.status(404).json({ message: 'Not found!' });
});

app.use((err, _, res, __) => {
  const { status = 500, message = 'Internal Server Error' } = err;

  res.status(status).json({ message });
});

export default app;
