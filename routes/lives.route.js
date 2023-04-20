const express = require("express");
const router = express.Router();

const liveController = require('../controllers/live.controller')

router.post(`/addLive`,  liveController.addLive);

router.get(`/allLives`,  liveController.getLives);

router.get(`/:id`,  liveController.getLive);

router.put(`/edit`,  liveController.editLive);

router.delete("/delete", liveController.deleteLive);



module.exports = router;
