module.exports = [
    {
        method: 'get',
        argument: '/:id',
        description:'information api status',
        name:'info',
        validate:'infoSchema',
        path: ['params'],
        controller: 'infoController',
        status: true,

    }
]
