module.exports = [
    {
        method: 'get',
        argument: '/:id',
        description:'information api status',
        name:'info',
        validate:'infoSchema',
        path: ['params'],
        service:'infoService',
        // handlers : [''],
        status: true,

    }
]
