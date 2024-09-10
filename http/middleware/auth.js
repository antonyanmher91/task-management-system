const { UnauthorizedException } = require("../../exceptions");

const auth = {
    userAuth: async (req, res, next) => {
        try {
            let bearer = req.headers.authorization;
            const token = bearer.split(" ");
            const obj = jwt.verify(token[1], process.env.JWT_SECRET);
            req.user = obj;
        } catch (error) {
            console.log(error);
            return next(new UnauthorizedException("Unauthorized: No authorization header"));
        }

        next();
    }
};

module.exports = auth;
