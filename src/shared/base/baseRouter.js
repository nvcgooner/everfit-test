const express = require('express');

/**
 * Base Router Factory
 * Creates router with common middleware and validation
 */
class BaseRouter {
  constructor() {
    this.router = express.Router();
  }

  /**
   * Register a route with automatic error handling
   * @param {String} method - HTTP method (get, post, put, delete)
   * @param {String} path - Route path
   * @param {Array} middlewares - Array of middlewares
   * @param {Function} handler - Route handler function
   */
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

  /**
   * Register POST route
   */
  post(path, middlewares = [], handler) {
    this.registerRoute('post', path, middlewares, handler);
  }

  /**
   * Register GET route
   */
  get(path, middlewares = [], handler) {
    this.registerRoute('get', path, middlewares, handler);
  }

  /**
   * Register PUT route
   */
  put(path, middlewares = [], handler) {
    this.registerRoute('put', path, middlewares, handler);
  }

  /**
   * Register DELETE route
   */
  delete(path, middlewares = [], handler) {
    this.registerRoute('delete', path, middlewares, handler);
  }

  /**
   * Get the Express router instance
   */
  getRouter() {
    return this.router;
  }
}

module.exports = BaseRouter;

