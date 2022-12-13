module.exports = [
    {
        method: 'get',
        path: '/:id',
        description:'information api status',
        name:'info',
        validate:{
            infoSchema: 'params'
        },
        controller: 'infoController'

    }
]
