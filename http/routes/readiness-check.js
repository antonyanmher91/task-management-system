const router = require("express").Router();
const { expressWrapper } = require('../../helper');

const { ReadinessCheckController } = require("../controllers");

/**
* @swagger
* /readiness-check:
*   get:
*     tags:
*       - System Services
*     summary:  readiness check
*     description: ''
*     operationId: readinessCheckAuth
*     consumes:
*       - application/json
*     produces:
*       - application/json
*     responses:
*       '200':
*        description: successful operation
*/
/* readiness check */
router.get("/", expressWrapper(ReadinessCheckController.readinessCheck));

module.exports = router;
