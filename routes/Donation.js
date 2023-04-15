const multer = require('multer');
const path = require('path');
const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');


// Route for creating a new donation
router.post('/donations', donationController.createDonationRequest);
// Route for deleting a donation by ID
router.delete('/donations/:id', donationController.deleteDonationRequest);


// Route for getting all donations with file name and folder
router.get('/donations', donationController.getAllDonations);

router.get('/donations/:id', donationController.getDonationById);
router.get('/donate/:donationId/:helperId/:amount/:byMatching', donationController.donate);

module.exports = router;
