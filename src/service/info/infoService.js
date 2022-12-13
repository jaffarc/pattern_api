const infoService = async () => {
    try {
        return { result: 'online' }
    } catch (error) {
        throw error
    }
}

module.exports = {
    infoService
}