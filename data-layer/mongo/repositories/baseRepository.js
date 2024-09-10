class BaseRepository {
    constructor(model) {
        this.model = model
    }
    async findOne ( filter, projection = null) {
        return await this.model.findOne(filter, projection, { lean: true });
    }
    async updateOne ( filter, update, options) {
        return await this.model.updateOne(filter, update, options);
    }
    async find ( filter, projection = null, options = { lean: true }) {
        return await this.model.find(filter, projection, options);
    }
    async create (insertData) {
        return await this.model.create(insertData);
    }
    async countDocuments(filter, options) {
        return await this.model.countDocuments(filter, options);
    }
    async bulkWrite(bulkOperations, options) {
        this.model.bulkWrite(bulkOperations, options)
    }
}
module.exports = BaseRepository