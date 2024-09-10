const BaseRepository = require("./baseRepository");

const {TasksModel} = require("../models/index")

const TaskRepository =  new BaseRepository(TasksModel)


module.exports = {
    TaskRepository
}