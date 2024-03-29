import ApiResponse from "../utils/ApiResponse.js";
function areValuesEqual(value1, value2) {
    return value1 === value2;
}
export default function validateUserIdToken(req, res, next) {
    const httpMethod = req.method;
    if (httpMethod === "GET" || httpMethod === "DELETE") {
        let userId;
        console.log(req.params);
        if (req.params.userId) {
            userId = req.params.userId;
        }
        if (req.query.userId) {
            userId = req.query.userId;
        }
        const { idUserToken } = req.body;
        if (!areValuesEqual(userId, idUserToken)) {
            return ApiResponse.unauthorized(res, "Unauthorized access");
        }
        else {
            next();
        }
    }
    else {
        const { idUserToken, userId } = req.body;
        if (!areValuesEqual(userId, idUserToken)) {
            return ApiResponse.unauthorized(res, "Unauthorized access");
        }
        else {
            next();
        }
    }
}
