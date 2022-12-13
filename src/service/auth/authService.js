

const authService = async () => {
    try {
        return {
            date: new Date(),
            token: 'fdsafaskfjksajasjlljf'
        } 

    } catch (error) {
        throw error
    }
}

module.exports = {
    authService
}