import createError from 'http-errors';
import express, { Request, Response } from 'express';
import logger from 'morgan';
import nocache from 'nocache';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

import indexRouter from './routes/index.js';
import flightRouter from './routes/flight.js';

const app = express();

app.use(logger('dev'));
app.use(nocache());
app.set('etag', false);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(join(__dirname, '../public')));

app.use('/api/flight', flightRouter);
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler has 4 parameters:
/* eslint-disable @typescript-eslint/no-unused-vars */
app.use((err: Error & {status?:number}, req: Request, res: Response, _: () => void) => {
  // only send error details in development
  const msg = {
    message: err?.message,
    error: req.app.get('env') === 'development' ? err : {}
  };
  console.log(`error at ${req.url}`, {err});

  res.status(err?.status || 500);
  res.json(msg);
});

export default app;
