
const app = require("express")();
const bodyParser = require("body-parser");
const errorMiddleware = require("./http/middleware/error");
const logger = require("./logger");
const path = require("path");
const morgan = require("morgan");
const authMiddleware = require("./http/middleware/auth")
const { $get, $set } = require("./variables");
require("dnscache")({ "enable": true, "ttl": 300, "cachesize": 1000 });
require("dotenv").config({ path: process.env.VAULT_ENV || path.resolve(__dirname, ".env") });
const task = require('./http/routes');
const healthCheck = require("./http/routes/health-check")
const readinessCheck = require("./http/routes/readiness-check")

require("dns");
require("dnscache")({
    enable: true,
    ttl: 600,
    cachesize: 50000
});
if (process.env.NODE_ENV === "DEVELOPMENT") {
    app.use(morgan("dev"));
}
/* Express middleware */
app.use(bodyParser.urlencoded({ extended: false, type: "application/x-www-form-urlencoded" }));
app.use(bodyParser.text({ type: "application/x-www-form-urlencoded", limit: "6mb" }));
app.use(bodyParser.raw({ type: "image/*", limit: "6mb" }));
app.use(bodyParser.json({
    type: function (v) {
        if (v.headers["content-type"]) {
            if (v.headers["content-type"].match(/multipart\/form-data/)) {
                return false;
            }
        }
        return true;
    },
    limit: "6mb"
}));

app.use((req, res, next) => {
    if ($get("SIGUSR1")) {
        morgan("combined")(req, res, next);
    } else {
        next();
    }
});
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    if (req.method === "OPTIONS") {
        const requestAllowHeaders = req.headers["access-control-request-headers"]
            ? req.headers["access-control-request-headers"]
                .split(",").map(item => item.trim())
            : [];
        requestAllowHeaders.push("Content-Type");
        res.setHeader("Access-Control-Allow-Headers", requestAllowHeaders.join(","));
        return res.send();
    }
    next();
});

app.use("/health-check", healthCheck);
app.use("/readiness-check", readinessCheck);

// app.use("/", authMiddleware.userAuth)
app.use("/", task);
/* Production Error Handler */
app.use(errorMiddleware);

/*
* App Connection
* */

const connect = (app, cb) =>
        $get("MongodbConnectionsStatus") === "connected"
        ? cb(app.listen(app.listen(process.env.SERVER_PORT || 3005, null, function () {
            app.emit("appStarted");
            $set('ReadinessCheck', true)
            logger.info("Node.js server is running at " +
                `http://${process.env.SERVER_HOSTNAME}:${process.env.SERVER_PORT} ` +
                `in ${process.env.NODE_ENV} mode with process id $i{process.pid}`
            );
        })))
        : setTimeout(() => {
            logger.info("tasks server is trying to establish");
            logger.info("MongodbConnectionsStatus: " + $get("MongodbConnectionsStatus"));
            connect(app, cb);
        }, 2000);

let service = null;
connect(app, (res) => (service = res));

const onTerminate = (name) => (err, promise) => {
    console.log(`ProcessEnded ${name}`);
    if (err && err instanceof Error) {
        console.log(err.message, err.stack);
        console.log(promise);
    } else {
        console.log(err);
    }
    process.exit(1);
};
const onGracefulShutdown = (name) => (err, promise) => service && service.close(() => {
    onTerminate(name)(err, promise);
});

process.on("uncaughtException", onTerminate("Unexpected Error"));
process.on("unhandledRejection", onTerminate("Unhandled Promise"));
process.on("SIGUSR1", () => {
    logger.info(`======================= SIGUSR1 ${new Date()} =======================`);
    $set("SIGUSR1", true);
});
process.on("SIGTERM", onGracefulShutdown("SIGTERM"));
process.on("SIGINT", onGracefulShutdown("SIGINT"));
process.on("beforeExit", (code) => {
    console.log("ProcessEnded - Process beforeExit event with code: ", code);
});
process.on("exit", (code) => {
    console.log("ProcessEnded - Process exit event with code: ", code);
});
process.on("warning", (warning) => {
    console.warn(warning.name); // Print the warning name
    console.warn(warning.message); // Print the warning message
    console.warn(warning.stack); // Print the stack trace
});
