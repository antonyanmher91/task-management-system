
const winston = require("winston");
const {
    DefaultException,
    ServerInternalException,
} = require("../../exceptions");
const {setExpired} = require("../../helper")
module.exports = async function errorMiddleware (err, req, res, next) {
    
    const error = typeof err !== "object"
    ? new ServerInternalException(String(err))
    : (err instanceof DefaultException ? err : new ServerInternalException(err));
    
    const exception = error.exception || "Default";
    let status = 0;
    if (error instanceof DefaultException) status = error.status || 500;
    /* Log Output */
    if (!(error instanceof DefaultException) || (status >= 500)) {
        setExpired(res, 0, "no-cache");
        winston.error(`${req.headers["front-request-id"] || ""} - ${req.originalUrl} - ${
            JSON.stringify(error.stack || error).slice(0, 1000)
        }`);
    }

    if (status === 401) {
        setExpired(res, 0, "no-cache");
    }

    error.content
    ? res.status(status).json({ error: error.content || {}, exception })
    : res.status(status).json({ message: error.message, error: {}, exception });
};
