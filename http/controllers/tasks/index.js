const {
  BadRequestException,
  NotFoundException,
} = require("../../../exceptions");
const taskService = require("../../../services/tasks/tasks");

const taskController = {
  async getTasks(req) {
    const tasks = await taskService.getTasks();
    return tasks;
  },
  async getTask  (req) {
    const {id} = req.params
     const task = await taskService.getTask(id);
     if(!task){
      throw new NotFoundException('Task not found')
     }
     return task;

  },
  async createTask(req){
    const body = req.body;
    await taskService.createTask(body);
    return {
      success: true
    }
  },
  async updtaTask(req){
    const body = req.body;
    const {id} = req.params;
    const taskUpdate = await taskService.updateTask(id, body);
    if(!taskUpdate) throw new BadRequestException('Task not found');
    return {
      success: true
    }
  },
  async getCompletionReport(req){
    const {startDate, endDate} = req.query;
    return taskService.getCompletionReport(startDate, endDate);
  },
  
  async getTaskSummary(){
    return await taskService.getTaskSummary()
  }
  
};


module.exports = taskController;
