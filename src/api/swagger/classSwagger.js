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
// components: {
//   schemas: {
//     auth: {
//       type: "object",
//       properties: {
//         last: {
//           type: "string",
//           required: true,
//         },
//         name: {
//           type: "string",
//           required: false,
//         },
//         date: {
//           type: "string",
//           required: false,
//         },
//       },
//     },
//     id: {
//       type: "string",
//       properties: {
//         id: {
//           type: "string",
//           required: true,
//         },
//       },
//     },
//   },
// },
//     paths: {
//       "/{id}": {
//         get: {
//           summary: "authentica o user",
//           consumes: ["application/json"],
//           tags: ["info"],
//           produces: "application/json",
//           parameters: [
//             {
//               in: "path",
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

class Swagger {
  static initialize(routeConfigs, routeSchemas) {
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
          schemas: routeSchemas, // Use as definições de esquema passadas como parâmetro
        },
        
      },
      apis: ["../router/**/*.js"],
    };

    
    const paths = {};

    for (const routeConfig of routeConfigs) {
      if (!routeConfig.status) continue;
    
      const schemaName = routeConfig.argument;
      const schema = require(`../router/${routeConfig.name}/${routeConfig.validate}`);
      
      const addedNames = new Set(); // Usado para rastrear nomes já adicionados
      const parameters = [];
    
      for (const key in schema) {
        if (routeConfig.path.includes(key) && schema.hasOwnProperty(key)) {
          for (const Name in schema[key]) {
            if (!schema[key][Name]?.type) {
              schema[key].$_terms.keys.forEach((v) => {
                const type = typeIN[key];
                const name = v.key;
    
                if (!addedNames.has(name)) {
                  addedNames.add(name);
                  parameters.push({
                    in: type,
                    name: name,
                    content: {
                      schema: {},
                    },
                  });
                }
              });
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
          parameters,
          responses: {
            200: {
              description: "Resposta de sucesso",
            },
          },
        },
      };
    
      const requestBody = {};
      if (routeConfig.type && routeConfig.type.includes("body")) {
        requestBody.content = {
          "application/json": {
            schema: {
              $ref: `#/components/schemas/${schemaName}`,
            },
          },
        };
      }
    
      paths[routeConfig.argument] = {
        ...(paths[routeConfig.argument] || {}),
        ...path,
        requestBody,
      };
    }
    
    // let parameters = [];
    // for (let a = 0; a < routeConfigs.length; a++) {
    //   if (routeConfigs[a].status) {
    //     const schemaName = routeConfigs[a].argument;
    //     const schema = require(`../router/${routeConfigs[a].name}/${routeConfigs[a].validate}`);
        
    //     const addedNames = new Set(); // Usado para rastrear nomes já adicionados

    //     for (const key in schema) {
    //       if (routeConfigs[a].path.includes(key) && schema.hasOwnProperty(key)) {
    //         const schemaKeys = Object.keys(schema[key]);
        
    //         for (const Name of schemaKeys) {
    //           if (!schema[key][Name]?.type) {
    //             console.log(key);
        
    //             schema[key].$_terms.keys.forEach((v) => {
    //               const type = typeIN[key];
    //               const name = v.key;

    //               if (!addedNames.has(name)) {
    //                 addedNames.add(name);
    //                 parameters.push({
    //                   in: type,
    //                   name: name,
    //                   content: {
    //                     schema: {},
    //                   },
    //                 });
    //               }
    //             });
    //           }
    //         }
    //       }
    //     }



    //     const path = {};
    //     path[routeConfigs[a].method.toLowerCase()] = {
    //       summary: routeConfigs[a].description,
    //       consumes: ["application/json"],
    //       tags: [routeConfigs[a].name],
    //       produces: "application/json",
    //       parameters,
    //       responses: {
    //         200: {
    //           description: "Resposta de sucesso",
    //         },
    //       },
    //     };

    //     const requestBody = {};
    //     if (routeConfigs[a].type && routeConfigs[a].type.includes("body")) {
    //       requestBody.content = {
    //         "application/json": {
    //           schema: {
    //             $ref: `#/components/schemas/${schemaName}`,
    //           },
    //         },
    //       };
    //     }

    //     paths[routeConfigs[a].argument] = {
    //       ...paths[routeConfigs[a].argument],
    //       ...path,
    //       requestBody,
    //     };
    //   }
    // }

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
