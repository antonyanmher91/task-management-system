const mongoose = require("mongoose");
const { $set } = require("../../../variables");
const DB = require("./db");
const logger = require("../../../logger");

mongoose.set('strictQuery', true);
mongoose.Promise = Promise;
const connections = {};

const statuses = {};
const isConnectionsEstablished = () =>
    statuses[DB.tasks]

const changeConnectionStatus = (name, status = true) => {
    const connectionsStatusBeforeChanges = isConnectionsEstablished();
    statuses[name] = status;
    const connectionsStatusAfterChanges = isConnectionsEstablished();
    console.log("connectionsStatusAfterChanges", connectionsStatusAfterChanges)
    if (connectionsStatusAfterChanges === connectionsStatusBeforeChanges) return;
    $set("MongodbConnectionsStatus", connectionsStatusAfterChanges ? "connected" : "disconnected");
};

const createConfiguration = (name) => {
    const url = process.env[`MONGO_${name}_HOST`];
    const options = {
        autoIndex: process.env.NODE_ENV === "DEVELOPMENT",
        bufferCommands: process.env[`MONGO_${name}_BUFFER_COMMAND`] || false,
        connectTimeoutMS: parseInt(process.env[`MONGO_${name}_CONNECTION_TIMEOUT_MS`] || 20000)
    };
    if (process.env[`MONGO_${name}_REPLICA_SET`]) {
        options.replicaSet = process.env[`MONGO_${name}_REPLICA_SET`];
        options.readPreference = process.env[`MONGO_${name}_READ_PREFERENCE`] || "secondaryPreferred";
    }
    return { url, options };
};

const createConnection = (name) => {
    const { url, options } = createConfiguration(name);
    connections[name] = mongoose.createConnection(url, options);
    connections[name].on("disconnected", (e) => {
        changeConnectionStatus(name, false);
        logger.error("Reconnecting to " + name);
        setTimeout(() => { createConnection(name); }, 5000);
    });
    connections[name].on("error", (e) => {
        logger.error(e);
    });
    connections[name].on("open", () => {
        changeConnectionStatus(name, true);
        logger.info(`Connected to MongoDB ${name} `);
    });
    return connections[name];
};

/*
* DB tasks Configuration
* */
const dbConfiguration = createConfiguration(DB.tasks);
mongoose.connect(dbConfiguration.url, dbConfiguration.options);
mongoose.connection.on("disconnected", (e) => {
    changeConnectionStatus(DB.tasks, false);
    logger.error("Reconnecting to " + dbConfiguration.url);
    setTimeout(() => {
        mongoose.connect(dbConfiguration.url, dbConfiguration.options);
    }, 5000);
});
mongoose.connection.on("open", (e) => {
    changeConnectionStatus("TASKS", true);
    logger.info("Connected to MongoDB TASKS DB");
});

mongoose.connection.on("error", (err) => {
    logger.error(err);
});

// IMPORTANT check functional after mongoose version updates
const __setOptions = mongoose.Query.prototype.setOptions;
mongoose.Query.prototype.setOptions = function (options, overwrite) {
    this.options.maxTimeMS = 20000;
    __setOptions.apply(this, arguments);
    return this;
};
/*
* Other Connections
* */
const connBase = mongoose.connection;

module.exports = {
    connBase,
};
