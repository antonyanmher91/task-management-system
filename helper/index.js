
function expressWrapper (cb) {
    return async (req, res, next) => {
        try {
            const data = await cb(req, res, next);
            res.json({ status: "OK", result: data || {} });
        } catch (err) {
            next(err);
        }
    };
}

function setExpired (res, time, type = "public") {
    res.setHeader("Cache-Control", `${type}, max-age=${time}`);
    res.setHeader("Expires", new Date(Date.now() + (time * 1000)).toUTCString());
}
module.exports = {
    expressWrapper,
    setExpired
}
