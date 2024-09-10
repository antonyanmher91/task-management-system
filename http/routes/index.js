const router = require("express").Router();
const taskController = require("../controllers/tasks")
const { expressWrapper, setExpired } = require('../../helper');
const { NotFoundException } = require("../../exceptions");

router.use("/", (req, res, next) => {
    setExpired(res, 15 * 60);
    next();
});

router.post('/tasks', expressWrapper(taskController.createTask));
router.put('/tasks/:id', expressWrapper(taskController.updateTask));
router.get('/tasks/:id', expressWrapper(taskController.getTask));
router.get('/tasks', expressWrapper(taskController.getTasks));
router.get('/tasks/reports', expressWrapper(taskController.getCompletionReport));
router.get('/tasks/summary', expressWrapper(taskController.getTaskSummary));

/* 404 */
router.use((req, res, next) => {
    next(new NotFoundException("Invalid Path"), req, res);
});
module.exports = router;