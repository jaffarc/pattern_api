
/** @module bookshelf 
 * @author Jaffar Cardoso <http://gitlab.com/jaffarc>
*/
module.exports = [
  {
    method: "patch",
    argument: "/change",
    description: "information api status",
    name: "change",
    validate: "changeSchema",
    path: ["body"],
    service: "changeService",
    handlers: [],
    getLog: false, /** captura o log completo entrada e saida da rota */
    handlersFirts: false, /** caso o middlewareValidate seja seja executado primeiro deixar como true  se os  handlers seja primeiro false */
    status: false, /** desativar rota */
  }
];
