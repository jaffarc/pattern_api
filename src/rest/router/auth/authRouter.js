module.exports = [
    {
        method: 'post',
        path: '/auth',
        description:'authentica o user',
        name:'auth',
        validate:{
            header: 'authSchema',
            body: 'authSchema'
        },
        controller: 'authController'

    }
]
