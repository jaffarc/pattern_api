
/** @module bookshelf 
 * @author Jaffar Cardoso <http://gitlab.com/jaffarc>
*/
module.exports = [
  {
    method: "post",  /** tipo da rota exe: router.post */
    argument: "/auth",  /** path da rota  */
    description: "authentica o user",
    name: "auth",
    validate: "authSchema",
    path: ["headers", "body"],
    service: "authService",
    handlers: ["restrictToMiddleware", "validateDateMiddleware"],
    handlersFirts: false,
    status: true,
  },
];
