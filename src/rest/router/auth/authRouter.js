module.exports = [
    {
        method: 'post',
        argument: '/auth',
        description:'authentica o user',
        name:'auth',
        validate: 'authSchema',
        path: ['body', 'headers'],
        controller: 'authController',
        status: true  
    }
]
