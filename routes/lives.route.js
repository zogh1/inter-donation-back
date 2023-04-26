const express = require("express");
const router = express.Router();

const liveController = require('../controllers/live.controller')

router.post(`/addLive`,  liveController.addLive);

router.get(`/allLives`,  liveController.getLives);

router.get(`/getLive/:id`,  liveController.getLive);

router.put(`/edit`,  liveController.editLive);

router.delete("/delete", liveController.deleteLive);

router.put("/participate", liveController.participate);

router.get(`/checkParicipation/:userId/:liveId`,  liveController.checkParticipation);






module.exports = router;
