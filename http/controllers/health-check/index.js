
const HealthCheckController = {
    healthCheck() {
        return {
            appStatus: 0,
            dbStatus: 0
        };
    },
}

module.exports = HealthCheckController;