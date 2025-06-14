import { Router } from "express";
import {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
} from "../controllers/playlist.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/create", verifyJWT, createPlaylist);

router.get("/getuser", verifyJWT, getUserPlaylists);

router.get("/getplaylist/:playlistId", verifyJWT, getPlaylistById);

router.patch("/addvideo/:playlistId/:videoId", verifyJWT, addVideoToPlaylist);

router.patch(
  "/removeVideo/:playlistId/:videoId",
  verifyJWT,
  removeVideoFromPlaylist
);

router.delete("/delete/:playlistId", verifyJWT, deletePlaylist);

router.patch("/update/:playlistId", verifyJWT, updatePlaylist);

export default router;
