module.exports = [
    {
        method: 'post',
        argument: '/auth',
        description:'authentica o user',
        name:'auth',
        validate: 'authSchema',
        path: ['headers','body'],
        service:'authService',
         handlers : ['restrictToMiddleware','validateDateMiddleware'],
        status: true  
    }
]
