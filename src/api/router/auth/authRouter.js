
/** @module bookshelf 
 * @author Jaffar Cardoso <http://gitlab.com/jaffarc>
*/
module.exports = [
  {
    method: "post",  /** tipo da rota exe: router.post */
    argument: "/auth",  /** path da rota  */
    description: "authentica o user", /** descriçao para doc da rota */
    name: "auth", /** nome da pasta do controler/router e service */
    validate: "authSchema", /** schema de validaçao para validar headers e body ou params */
    path: ["headers", "body"], /** o que vai ser validado no schema */
    service: "authService", /** nome da função do service a ser chamado no controller */
    handlers: ["validateDateMiddleware","restrictToMiddleware"], /** Middleware que deve sera adicionado a rota, esse sao personalidado */
    params:{
      restrictToMiddleware: ['user']  /** caso o Middleware seja personalizado e tenha params informar aqui funcion e params */
    },
    getLog: true, /** captura o log completo entrada e saida da rota */
    handlersFirts: false, /** caso o middlewareValidate seja seja executado primeiro deixar como true  se os  handlers seja primeiro false */
    status: true, /** desativar rota */
  },
];
