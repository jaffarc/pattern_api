const mongoose = require('mongoose');

class Database {
  constructor() {
    this.options = {
      keepAlive: true,
      connectTimeoutMS: 300000,
      socketTimeoutMS: 300000,
      bufferCommands: true,
      maxPoolSize: 4,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    this.mongoUrl = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PWD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}?authSource=${process.env.MONGO_AUTH_SOURCE}&authMechanism=SCRAM-SHA-1`;
  // console.log(this.mongoUrl)
    this.db = mongoose.createConnection(this.mongoUrl, this.options);

    this._setupEventListeners();

    process.on('exit', code => {
      this.db.close();
      console.log(`About to exit with code: ${code}`);
    });

    process.on('SIGINT', function () {
      console.log('Caught interrupt signal');
      process.exit();
    });

    this.DB = this.db.useDb(process.env.MONGO_DB);
  }

  _setupEventListeners() {
    this.db.once('connected', () => {
      console.log('Mongodb connection', process.env.NODE_ENV, process.env.MONGO_DB);
    });

    this.db.on('disconnected', () => {
      console.log('Connection to MongoDB lost');
      // this.reconnect();
    });

    this.db.on('error', err => {
      console.log(`Error in MongoDB connection: ${err}`);
    });

    this.db.on('reconnected', () => {
      console.log('Successfully reconnected to MongoDB');
    });
  }

  reconnect() {
    console.log('Attempting to reconnect to MongoDB...');
    this.db.reconnect();
  }
}

module.exports = new Database();
