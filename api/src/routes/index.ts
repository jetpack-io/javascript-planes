import { Request, Response } from 'express';
import Router from 'express-promise-router';
import { dirname, join } from 'path';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';

const router = Router();


const __dirname = dirname(fileURLToPath(import.meta.url));
const dir = join(__dirname, '../../public');
const index = join(dir, 'index.html');
const exists = existsSync(index);
const isProd = process.env.NODE_ENV === 'production';

router.get('/', function(req: Request, res: Response) {
  if (!isProd && !exists) {
    // so app knows the api is running
    res.send('<h1>JavaScript Planes</h1><p>This page is replaced with the app in production.</p>');
  } else {
    res.sendFile(index);
  }
});

export default router;
