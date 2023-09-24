const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const { Router } = require("express");
const { typeIN } = require("../../utils/helper");
const joi = require("joi");
const pkg = require("../../../package.json");

// const test = {
//   swaggerDefinition: {
//     openapi: "3.0.0",
//     info: {
//       title: "pattern_api",
//       version: "1.0.0",
//       description:
//         "Pattern para uma api rest com doc gerado dinamic, com middleware dinamic e personalizado por rota",
//     },
//     components: {
//       schemas: {
//         auth: {
//           type: "object",
//           properties: {
//             last: {
//               type: "string",
//               required: true,
//             },
//             name: {
//               type: "string",
//               required: false,
//             },
//             date: {
//               type: "string",
//               required: false,
//             },
//           },
//         },
//         id: {
//           type: "string",
//           properties: {
//             id: {
//               type: "string",
//               required: true,
//             },
//           },
//         },
//       },
//     },
//     paths: {
//       "/auth": {
//         post: {
//           summary: "authentica o user",
//           consumes: ["application/json"],
//           tags: ["auth"],
//           produces: "application/json",
//           requestBody: {
//             description: "Created user object",
//             content: {
//               "application/json": {
//                 schema: {
//                   $ref: "#/components/schemas/auth",
//                 },
//               },
//             },
//           },
//           parameters: [
//             {
//               in: "header",
//               name: "id",
//               required: true,

//               schema: {
//                 $ref: "#/components/schemas/id",
//               },
//             },
//           ],
//           responses: {
//             200: {
//               description: "Resposta de sucesso",
//             },
//           },
//         },
//       },
//     },
//   },
//   apis: [],
// };

function addElement(ElementList, element) {
  let newList = Object.assign(ElementList, element);
  return newList;
}
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
        servers: [
          {
            url: "http://localhost:3080/",
            description: "Local Server",
          },
        ],
        components: {
          schemas: {}, // Use as definições de esquema passadas como parâmetro
        },
      },
      apis: ["../router/**/*.js"],
    };

    const paths = {};
    let parameters;

    for (const routeConfig of routeConfigs) {
      if (!routeConfig.status) continue;

      const schemaName = routeConfig.argument;
      const schema = require(`../router/${routeConfig.name}/${routeConfig.validate}`);
      // console.log(routeConfig)
      const addedNames = new Set(); // Usado para rastrear nomes já adicionados
      let requestBody = {};

      if (!options.swaggerDefinition.components?.schemas[schemaName]) {
        const schemaObject = Object.keys(schema);

        for (const key in schema) {
          for (const Name in schema[key]) {
            if (!schema[key][Name]?.type) {
              if (!addedNames.has(schema[key].$_terms.keys)) {
                addedNames.add(schema[key].$_terms.keys);
                const schemaKeyNames = schema[key].$_terms.keys.map((v) => ({
                  key: `${v.key}`,
                  type: v.schema.type,
                  required:
                    v.schema._flags.presence === "required" ? true : false,
                }));

                let n = schemaName.replace("/", "");
                options.swaggerDefinition.components.schemas[n] = {
                  type: "object",
                  properties: Object.fromEntries(
                    schemaKeyNames.map((p) => [
                      p.key,
                      {
                        type: p.type,
                        required: p.required,
                      },
                    ])
                  ),
                  type: "object",
                };
                if (key === "body") {
                  addElement(requestBody, {
                    description: "Created user object",
                    content: {
                      "application/json": {
                        schema: {
                          $ref: `#/components/schemas/${n}`,
                        },
                      },
                    },
                  });
                }
                if (key !== "body") {
                  parameters = schema[key].$_terms.keys.map((v) => {
                    // console.log("aaaaa", key);
                    return {
                      in: typeIN[key],
                      name: v.key,
                      type: v.schema.type.toLowerCase(),
                      description: v.schema._flags?.description || "",
                      required:
                        v.schema._flags?.presence === "required" ? true : false,
                    };
                  }, {});
                }

                // console.log(options.swaggerDefinition.components.schemas);
              }
            }
          }
        }
      }

      const path = {
        [routeConfig.method.toLowerCase()]: {
          summary: routeConfig.description,
          consumes: ["application/json"],
          tags: [routeConfig.name],
          produces: "application/json",
          requestBody,
          parameters,
          responses: {
            200: {
              description: "Resposta de sucesso",
            },
          },
        },
      };

      paths[routeConfig.argument] = {
        ...(paths[routeConfig.argument] || {}),
        ...path,
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

    // console.log(JSON.stringify(swaggerOptions, null, 3));

    const swaggerSpec = swaggerJSDoc(swaggerOptions);
    router.use("/api-docs", swaggerUi.serve);
    router.get("/api-docs", swaggerUi.setup(swaggerSpec));

    return router;
  }
}

module.exports = Swagger;
