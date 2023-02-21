const infoService = async () => {
    try {
        return  'online' 
    } catch (error) {
        throw error
    }
}

module.exports = {
    infoService
}