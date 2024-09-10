const { connBase } = require("../connections");
const COLLECTIONS = require("../connections/collections");
const { tasksSchema  } = require("../schemas");


const TasksModel = connBase.model(COLLECTIONS.TASKS.name, tasksSchema, COLLECTIONS.TASKS.collection);

module.exports = {
    TasksModel
}