const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const { Router } = require("express");
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
        components: {
          schemas: routeSchemas, // Use as definições de esquema passadas como parâmetro
        },
      },
      apis: ["../router/**/*.js"],
    };
    const paths = {};

    let parameters = [];
    for (let a = 0; a < routeConfigs.length; a++) {
      if (routeConfigs[a].status) {
        const schemaName = routeConfigs[a].argument;
        const schema = require(`../router/${routeConfigs[a].name}/${routeConfigs[a].validate}`);

        const keysFound = new Set();
        for (const key in schema) {

          if (routeConfigs[a].path.includes(key)) {
            if (Object.hasOwnProperty.call(schema, key)) {
              for (const Name of Object.keys(schema[key])) {
                // if (!keysFound.has(key)) {
                //   keysFound.add(key);
                
                  if (Name !== 'type' && schema[key][Name]?.type) {
                    let name = Name
                    let type = schema[key][name]?.type;

                    console.log( schema[key][name]?.type)
                    // let type = schema[key]
                    // console.log(type)
                    parameters.push({
                      in: key,
                      name: name,
                      schema: {
                        type, //headerSchema._type, // Use o tipo do Joi
                        //example: ;;headerSchema._examples ? headerSchema._examples[0] : undefined, // Use o primeiro exemplo, se houver
                      },
                      // required: true, // Defina como necessário, pois você usou .required() no Joi
                    });
                  }

                  // parameters.push({
                  //   in: key,
                  //   name: 'headerName',
                  //   schema: {
                  //     type: String, //headerSchema._type, // Use o tipo do Joi
                  //     //example: ;;headerSchema._examples ? headerSchema._examples[0] : undefined, // Use o primeiro exemplo, se houver
                  //   },
                  //   // required: true, // Defina como necessário, pois você usou .required() no Joi
                  // });
                  // console.log("__", key);
                // }
              }
            }
          }

        }








        // if (schema.headers) {
        //   for (const headerName in schema.headers) {
        //     if (Object.hasOwnProperty.call(schema.headers, headerName)) {
        //       const headerSchema = schema.headers[headerName];
        //       // console.log("aa",headerSchema)
        //       parameters.push({
        //         in: "header",
        //         name: headerName,
        //         schema: {
        //           type: headerSchema._type, // Use o tipo do Joi
        //           example: headerSchema._examples ? headerSchema._examples[0] : undefined, // Use o primeiro exemplo, se houver
        //         },
        //         // required: true, // Defina como necessário, pois você usou .required() no Joi
        //       });
        //     }
        //   }
        // }

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
                $ref: `#/components/schemas/${schemaName}`,
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



