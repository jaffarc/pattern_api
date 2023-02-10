module.exports = [
    {
        method: 'post',
        argument: '/auth',
        description:'authentica o user',
        name:'auth',
        validate: 'authSchema',
        path: ['headers','body'],
        controller: 'authController',
        status: true  
    }
]
