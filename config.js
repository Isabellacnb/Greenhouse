const config = {

    app: {
        port: process.env.PORT || 3000
    }, 

    db: {
        connectionUrl: process.env.MONGO_URL || 'mongodb://localhost/greenhouse'
    }
}

module.exports = config;