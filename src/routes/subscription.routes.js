import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    toggleSubscription,
    getChannelSubscribers,
    getSubscribedChannels
} from "../controllers/subscription.controller.js"




const router = Router()

router.route("/toggle/:channelId").post(verifyJWT, toggleSubscription);
router.route("/subscribers/:channelId").get(getChannelSubscribers);
router.route("/subscribedTo/:subscriberId").get(getSubscribedChannels);


export default router