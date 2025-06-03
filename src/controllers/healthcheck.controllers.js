import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/acyncHandler.js";

const healthcheck = asyncHandler(async (req, res) => {
  return res.status(200).json(new ApiResponse(200, "ok", "healthcheck passed"));
});
export { healthcheck };
