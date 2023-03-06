const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const { Router } = require('express');

class Swagger {
  static initialize(routeConfigs) {
    const router = Router();

    const options = {
      swaggerDefinition: {
        openapi: '3.0.0',
        info: {
          title: 'My API',
          version: '1.0.0',
          description: 'Descrição da API',
        },
      },
      apis: [''],
    };

  
    const paths = {};
    for (const routeConfig of routeConfigs) {
      const path = {};
      const handlers = [];

      for (const handler of routeConfig.handlers) {
        const middleware = {
          operationId: handler,
        };

        if (routeConfig.params && routeConfig.params[handler]) {
          middleware.parameters = routeConfig.params[handler].map((param) => ({
            name: param.name,
            in: param.in,
            schema: {
              type: param.type,
            },
          }));
        }

        handlers.push(middleware);
      }

      path[routeConfig.method] = {
        summary: routeConfig.description,
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: `#/components/schemas/${routeConfig.validate}`,
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Resposta de sucesso',
          },
        },
        'x-handler': routeConfig.service,
        'x-middlewares': handlers,
      };

      paths[routeConfig.argument] = path;
    }

    const swagger = {
      ...options.swaggerDefinition,
      components: {
        schemas: {
          authSchema: {
            type: 'object',
            properties: {
              username: { type: 'string' },
              password: { type: 'string' },
            },
            required: ['username', 'password'],
          },
        },
      },
      paths,
    };

  
    const swaggerOptions = {
      swaggerDefinition: swagger,
      apis: [],
    };

  
    const swaggerSpec = swaggerJSDoc(swaggerOptions);
    router.use('/api-docs', swaggerUi.serve);
    router.get('/api-docs', swaggerUi.setup(swaggerSpec));

    return router;
  }
}

module.exports = Swagger;
