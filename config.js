const config = {

    app: {
        port: process.env.PORT || 3000
    }, 

    db: {
        connectionUrl: process.env.MONGODB_HOST || 'mongodb://localhost/greenhouse'
    }
}

module.exports = config;