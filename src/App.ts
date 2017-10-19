import * as express from 'express';
import { buildUserSchema } from './Mongoose';

class App {
  public express;

  constructor() {
    this.express = express();
    this.mountRoutes();
  }

  private mountRoutes(): void {
    const router = express.Router();
    router.get('/', (req, res) => {
      res.json({
        message: 'Hello World!'
      });
      buildUserSchema();
    });
    this.express.use('/', router);
  }
}

export default new App().express;
