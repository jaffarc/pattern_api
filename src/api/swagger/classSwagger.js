const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const { Router } = require("express");
const joi = require("joi");
const pkg = require("../../../package.json");

class Swagger {
  static initialize(routeConfigs) {
    const router = Router();

    const options = {
      swaggerDefinition: {
        openapi: "3.0.0",
        info: {
          title: `${pkg.name}`,
          version: `${pkg.version}`,
          description: `${pkg.description}`,
        },
      },
      apis: ["../router/**/*.js"],
    };
    const paths = {};
    for (let a = 0; a < routeConfigs.length; a++) {
      const schema = require(`../router/${routeConfigs[a].name}/${routeConfigs[a].validate}`);
      if (schema[Object.keys(schema)[0]]) {
        let parameters = [];

        for (let i = 0; i < routeConfigs[a].path.length; i++) {
          const pathKey = routeConfigs[a].path[i];
          const schemaKey = `${pathKey}Schema`;
          const schemaObject = schema[schemaKey];

          const schemaKeyNames =
            schemaObject && schemaObject.$_terms
              ? schemaObject.$_terms.keys.map((key) => ({
                  key: key.key,
                  type: key.schema.type,
                  required:
                    key.schema._flags.presence === "required" ? true : false,
                }))
              : [];

          let properties = [];
    
          for (let p of schemaKeyNames) {
            // console.log({ [p.key]: { type: p.type } });

            properties.push({ [p.key]:  p.type  });
          }

          const Parameter = { in: pathKey, properties };

          console.log(Parameter);
          parameters.push(Parameter);
        }

        const path = {};
        path[routeConfigs[a].method] = {
          summary: routeConfigs[a].description,
          tags: [routeConfigs[a].name],
          parameters: parameters,
          responses: {
            200: {
              description: "Resposta de sucesso",
            },
          },
        };
        paths[routeConfigs[a].argument] = {
          ...paths[routeConfigs[a].argument],
          ...path,
        };
      }
    }
    // console.log(JSON.stringify(paths, null, 3))
    const swagger = {
      ...options.swaggerDefinition,
      components: {
        schemas: {
          authSchema: {
            type: "object",
            properties: {
              last: {
                type: "string",
              },
              name: {
                type: "string",
              },
              date: {
                type: "string",
              },
            },
            // required: ["username", "password"],
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
    router.use("/api-docs", swaggerUi.serve);
    router.get("/api-docs", swaggerUi.setup(swaggerSpec));

    return router;
  }
}

module.exports = Swagger;
