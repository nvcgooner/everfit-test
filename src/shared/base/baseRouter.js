const express = require('express');

class BaseRouter {
  constructor() {
    this.router = express.Router();
  }

  registerRoute(method, path, middlewares = [], handler) {
    const wrappedHandler = async (req, res, next) => {
      try {
        await handler(req, res, next);
      } catch (error) {
        next(error);
      }
    };

    this.router[method](path, ...middlewares, wrappedHandler);
  }

  post(path, middlewares = [], handler) {
    this.registerRoute('post', path, middlewares, handler);
  }

  get(path, middlewares = [], handler) {
    this.registerRoute('get', path, middlewares, handler);
  }

  put(path, middlewares = [], handler) {
    this.registerRoute('put', path, middlewares, handler);
  }

  delete(path, middlewares = [], handler) {
    this.registerRoute('delete', path, middlewares, handler);
  }

  getRouter() {
    return this.router;
  }
}

module.exports = BaseRouter;

