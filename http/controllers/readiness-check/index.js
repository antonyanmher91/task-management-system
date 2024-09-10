const { $get } = require("../../../variables");
const { ServiceUnavailableException } = require("../../../exceptions");

const ReadinessCheckController = {
    readinessCheck() {
        if ($get("ReadinessCheck") && !$get("SIGUSR1")) {
            return {
                success: true
            };
        }
        
    
        throw new ServiceUnavailableException("Readiness check failed");
    }
}

module.exports = ReadinessCheckController
