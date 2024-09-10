const router = require("express").Router();
const { expressWrapper } = require('../../helper');
const { HealthCheckController } = require("../controllers");

/**
* @swagger
* /health-check:
*   get:
*     tags:
*       - System Services
*     summary: App Health check
*     description: ''
*     operationId: healthCheckApp
*     consumes:
*       - application/json
*     produces:
*       - application/json
*     responses:
*       '200':
*        description: successful operation
*/
/* Health check */
router.get("/", expressWrapper(HealthCheckController.healthCheck));

module.exports = router;
