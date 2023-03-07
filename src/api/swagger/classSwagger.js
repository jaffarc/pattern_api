const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const { Router } = require('express');
const joi = require("joi");


const paramsSchema = joi.object().keys({
  id: joi.string()
        .regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
        .required()
}).required()
.error((errors) => Object.assign(...errors, { message: 'ERRO_OBJECT_ID' }));

// Cria um objeto vazio
const schemaKeys = {};

// Obtém as chaves do schema
const schemaKeyNames = Object.keys(paramsSchema.describe().keys);

// Preenche o objeto com as chaves e a indicação de se são obrigatórias ou não
for (const keyName of schemaKeyNames) {
  const keySchema = paramsSchema.describe().keys[keyName];
  schemaKeys[keyName] = { required: keySchema.presence === 'required' };
}

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
      apis: ['../router/**/*.js'],
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
                $ref: `#/components/schemas/${schemaKeys}`,
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
      // components: {
      //   schemas: {
      //     authSchema: {
      //       type: 'object',
      //       properties: {
      //         username: { type: 'string' },
      //         password: { type: 'string' },
      //       },
      //       required: ['username', 'password'],
      //     },
      //   },
      // },
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
