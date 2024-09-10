const {
  TaskRepository,
} = require("../../data-layer/mongo/repositories");
const mongoose = require("mongoose");
const moment = require("moment");

async function getTasks() {
  const tasks = await TaskRepository.find();
  return tasks
}


async function getTask(id){
  const task = await TaskRepository.findOne({ _id: mongoose.Types.ObjectId(id) });
  return task
}

async function createTask(body){
  await TaskRepository.create(body);
  return true;
}

async function updateTask(id, body){
  const task = await TaskRepository.updateOne({ _id: mongoose.Types.ObjectId(id) }, body, { new: true });
  if (task.nModified === 0) return false;
  return true;
}
async function getCompletionReport (startDate, endDate) {
  return TaskRepository.aggregate([
      { $match: { status: 'completed', createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) } } },
      { $group: { _id: '$assignedMember', total: { $sum: 1 }, averageCompletionTime: { $avg: { $subtract: [ '$updatedAt', '$createdAt' ] } } } }
  ]);
}

async function getTaskSummary () {
  const totalTasks = await TaskRepository.countDocuments();
  const completedTasks = await TaskRepository.countDocuments({ status: 'completed' });
  const averageCompletionTime = await TaskRepository.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, average: { $avg: { $subtract: [ '$updatedAt', '$createdAt' ] } } } }
  ]);

  return {
      totalTasks,
      completedTasks,
      averageCompletionTime: averageCompletionTime[0] ? averageCompletionTime[0].average : 0
  };
}

module.exports = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  getCompletionReport,
  getTaskSummary
};
