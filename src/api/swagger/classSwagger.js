const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const { Router } = require("express");
const joi = require("joi");
const pkg = require("../../../package.json");

const test = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "pattern_api",
      version: "1.0.0",
      description:
        "Pattern para uma api rest com doc gerado dinamic, com middleware dinamic e personalizado por rota",
    },
    components: {
      schemas: {
        auth: {
          type: "object",
          properties: {
            last: {
              type: "string",
              required: true,
            },
            name: {
              type: "string",
              required: false,
            },
            date: {
              type: "string",
              required: false,
            },
          },
        },
        id: {
          type: "string",
          properties: {
            id: {
              type: "string",
              required: true,
            },
          },
        },
      },
    },
    paths: {
      "/{id}": {
        get: {
          summary: "authentica o user",
          consumes: ["application/json"],
          tags: ["info"],
          produces: "application/json",
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: {
                $ref: "#/components/schemas/id",
              },
            },
          ],
          responses: {
            200: {
              description: "Resposta de sucesso",
            },
          },
        },
      },
      "/auth": {
        post: {
          summary: "authentica o user",
          consumes: ["application/json"],
          tags: ["auth"],
          produces: "application/json",
          requestBody: {
            description: "Created user object",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/auth",
                },
              },
            },
          },
          parameters: [
            {
              in: "header",
              name: "id",
              required: true,

              schema: {
                $ref: "#/components/schemas/id",
              },
            },
        
          ],
          responses: {
            200: {
              description: "Resposta de sucesso",
            },
          },
        },
      },
    },
  },
  apis: [],
};

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
        components: {
          schemas: {},
        },
      },
      apis: ["../router/**/*.js"],
    };
    const paths = {};

    for (let a = 0; a < routeConfigs.length; a++) {
      const schemaName = routeConfigs[a].argument;
      const schema = require(`../router/${routeConfigs[a].name}/${routeConfigs[a].validate}`);

      // Verificar se o schema já existe e, caso não exista, criá-lo
      if (!options.swaggerDefinition.components.schemas[schemaName]) {
        const schemaObject = schema[Object.keys(schema)[0]];
        const schemaType =
          schemaObject && schemaObject.type === "object" ? "object" : undefined;

        options.swaggerDefinition.components.schemas[schemaName] = {
          type: schemaType,
          properties: {},
        };

        const schemaKeyNames =
          schemaObject && schemaObject.$_terms
            ? schemaObject.$_terms.keys.map((key) => ({
                key: key.key,
                type: key.schema.type,
                required:
                  key.schema._flags.presence === "required" ? true : false,
              }))
            : [];

        for (let p of schemaKeyNames) {
          options.swaggerDefinition.components.schemas[schemaName].properties[
            p.key
          ] = {
            type: p.type,
            required: p.required,
          };
        }
      }

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

        for (let j = 0; j < schemaKeyNames.length; j++) {
          const param = {
            in: schemaKeyNames[j].type,
            name: schemaKeyNames[j].key,
            // description: routeConfigs[a].description,
            required: true,
          };

          if (routeConfigs[a].path[j] === "body") {
            param["application/json"] = {
              schema: {
                $ref: `#/components/schemas${schemaName}`,
              },
            };
          }

          parameters.push(param);
        }
      }

      const path = {};
      path[routeConfigs[a].method.toLowerCase()] = {
        summary: routeConfigs[a].description,
        consumes: ["application/json"],
        tags: [routeConfigs[a].name],
        produces: "application/json",
        parameters,
        responses: {
          200: {
            description: "Resposta de sucesso",
          },
        },
      };

      const requestBody = {};
      if (routeConfigs[a].type && routeConfigs[a].type.includes("body")) {
        requestBody.content = {
          "application/json": {
            schema: {
              $ref: `#/components/schemas${schemaName}`,
            },
          },
        };
      }

      paths[routeConfigs[a].argument] = {
        ...paths[routeConfigs[a].argument],
        ...path,
        requestBody,
      };
    }

    const swagger = {
      ...options.swaggerDefinition,
      paths,
    };

    const swaggerOptions = {
      swaggerDefinition: swagger,
      apis: [],
    };

    console.log(JSON.stringify(swaggerOptions, null, 3));

    const swaggerSpec = swaggerJSDoc(test);
    router.use("/api-docs", swaggerUi.serve);
    router.get("/api-docs", swaggerUi.setup(swaggerSpec));

    return router;
  }
}

module.exports = Swagger;

// [routeConfigs[a].name]: {
//   summary: routeConfigs[a].description,
//   consumes: "application/json",
//   tags: [routeConfigs[a].name],
//   parameters: parameters,
//   responses: {
//     200: {
//       description: "Resposta de sucesso",
//     }
//   }
// },

// console.log("aaa", ...new Set(parameters));
// const arrUnique = [...new Set(parameters)];
// console.log(parameters);
// for (let p of schemaKeyNames) {
//   const parameter = {
//     name: pathKey,
//     in: pathKey,
//     type: p.type,
//     required: p.required,
//     explode: true,
//   };
// parameters.push(parameter);
// parameters.push(Object.assign( parameter,        {  schema: {
//           $ref: `#/components/schemas/${routeConfigs[a].name}`
//         }}))
// }
