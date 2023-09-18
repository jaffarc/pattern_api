module.exports = [
  {
    method: "get",
    argument: "/id",
    description: "information api status",
    name: "info",
    validate: "infoSchema",
    path: ["params"],
    service: "infoService",
    handlers: [],
    getLog: false, /** captura o log completo entrada e saida da rota */
    handlersFirts: false, /** caso o middlewareValidate seja seja executado primeiro deixar como true  se os  handlers seja primeiro false */
    status: true, /** desativar rota */
];
