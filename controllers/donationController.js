// controllers/donationController.js

const DonationRequest = require('../models/Donation');
const upload = require('../middleware/Multer');
const User = require('../models/user'); // import User schema file
const sgMail = require('@sendgrid/mail');

// Function for creating a new donation request
const { ComputerVisionClient } = require("@azure/cognitiveservices-computervision");
const { CognitiveServicesCredentials } = require("@azure/ms-rest-azure-js");
const mongoose = require('mongoose');

// Function for creating a new donation request
exports.createDonationRequest = async (req, res) => {
    const computerVisionKey = process.env["computerVisionKey"] || "<computerVisionKey>";
    const computerVisionEndPoint = process.env["computerVisionEndPoint"] || "<computerVisionEndPoint>";
    upload.single('media')(req, res, async function (error) {
        if (error) {
            console.log('upload.single error:' + error);
            return res.sendStatus(500);
        }

        const { type, title, description, amount, currency } = req.body;
        const user = req.body.user;

        // Create a new DonationRequest object
        const newDonationRequest = new DonationRequest({
            user,
            type,
            title,
            description,
            amount,
            currency,
        });

        // Upload the media file using multer and add the file path to the donation request object
        const url = req.protocol + '://' + req.get('host');
        console.log('++++++', url)
        if (req.file != undefined) {
            console.log("------------------------------")
            console.log("------------------------------")
            newDonationRequest.media = url + '/uploads/' + req.file.filename
        }
        console.log('/public/uploads/' + req.file.filename)
        // Analyze the image using Azure Cognitive Services
        const fs = require('fs');
        const fetch = require('node-fetch');
        const image = './public/uploads/' + req.file.filename;
        fs.readFile(image, (err, data) => {
            if (err) {
                console.error(err);
                return;
            }

            const headers = new fetch.Headers();
            headers.append('Content-Type', 'application/octet-stream');
            headers.append('Ocp-Apim-Subscription-Key', computerVisionKey);

            const requestOptions = {
                method: 'POST',
                headers,
                body: data,
            };

            fetch(computerVisionEndPoint, requestOptions)
                .then(async (response) => {
                    const data = await response.json();
                    console.log(data);
                    if (data.categories && data.adult) {
                        // Check if the image contains adult or racy content
                        if (data.adult.isAdultContent || data.adult.isRacyContent) {
                            res.json('The image contains adult or racy content and cannot be used for a donation request');

                            throw new Error('The image contains adult or racy content and cannot be used for a donation request');
                        }

                        // Check for racist content
                        const peopleGroup = data.categories.find(category => category.name === 'people_group');
                        const racistFlags = ['nazi', 'confederate', 'kkk'];
                        const hasRacistContent = data.tags.some(tag => racistFlags.includes(tag.name.toLowerCase()));

                        // Check for brutal and violent content
                        const brutalFlags = ['weapon', 'blood', 'crime', 'firearm', 'injury', 'violence'];
                        const hasBrutalContent = data.tags.some(tag => brutalFlags.includes(tag.name.toLowerCase()));

                        if (hasRacistContent || hasBrutalContent) {
                            res.json('The image contains racist, brutal, or violent content and cannot be used for a donation request');
                            throw new Error('The image contains racist, brutal, or violent content and cannot be used for a donation request');
                        }

                        newDonationRequest.analyse = JSON.stringify({
                            categories: data.categories,
                            adult: {
                                isAdultContent: data.adult.isAdultContent,
                                isRacyContent: data.adult.isRacyContent,
                                adultScore: data.adult.adultScore,
                                racyScore: data.adult.racyScore,
                            },
                            peopleGroupScore: peopleGroup ? peopleGroup.score : 0,
                        });
                    }
                    try {
                        const savedDonationRequest = await newDonationRequest.save();
                        res.json({
                            message: 'Donation request created successfully',
                            donationRequest: savedDonationRequest,
                            analyseData: newDonationRequest.analyse,
                        });
                    } catch (error) {
                        console.log('error :', error);
                        res.json(error);
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        })
    });
}

// Function for deleting a donation request
exports.deleteDonationRequest = async (req, res) => {
    try {
        const deletedDonationRequest = await DonationRequest.findByIdAndDelete(req.params.id);
        if (!deletedDonationRequest) {
            return res.status(404).json({ error: 'Donation request not found' });
        }
        res.json({ message: 'Donation request deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getAllDonations = async (req, res) => {
    try {
        const donations = await DonationRequest.find();
        res.json(donations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



exports.getDonationById = async (req, res) => {
    const donationId = req.params.id;
    try {
        const donation = await DonationRequest.findById(donationId).populate('user').exec();
        if (!donation) {
            return res.status(404).json({
                success: false,
                message: 'Donation not found',
            });
        }
        return res.status(200).json({
            success: true,
            donation,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

exports.donate = async (req, res) => {
    try {
        console.log(req.params)
        const donation_id = req.params.donationId;
        const helperID = req.params.helperId;
 
        const amount = req.params.amount;
        const byMatching = false
     
      
  
        // get the donation by donation id
        const dt = await Donation.findById(donation_id);
  console.log(dt);
        if (!dt) {
       
        }
  
        // get the user by helper id
        const helperUser = await User.findById(helperID);
  
        if (!helperUser) {
       
        }
  
       
        // add the helper to donation helpers
  
  
        if (amount > 0) {
         
  
  
            if (byMatching ==false) {
                // send emails to users from the same company as the donor
                const donorUser = await User.findById(dt.user);
  
                const usersInSameCompany = await User.find({ company: donorUser.company });
  console.log(usersInSameCompany);
                const emailPromises = usersInSameCompany
                    .filter((user) => user._id.toString() !== donorUser._id.toString())
                    .map((user) => {
                        const msg = {
                            to: user.email,
                            from: 'twinpidev22@gmail.com', // Replace with your own email address
                            subject: 'Donnate like your colleague',
                            html: `<!DOCTYPE html>
                            <html>
                              <head>
                                <meta charset="UTF-8">
                                <title>Donation Request</title>
                              </head>
                              <body>
                                <h1>Donation Request</h1>
                                <p>Hi ${user.firstName},</p>
                                <p>A donation request has been helped by ${donorUser.firstName} ${donorUser.lastName}. If you want to donate, please click the button below:</p>
                                <a href="http://localhost:3000/cause-details/${donation_id}/true">Donate</a>
                              </body>
                            </html>`,
                        };
                        sgMail.send(msg, (error, result) => {
                            if (error) {
                                console.log(error);
                             
                            } else {
                              console.log('Sent222.');
                               
                            }
                        });
                    });
  
                await Promise.all(emailPromises);
            }
          
        }
        else {
  
          
        }
    } catch (error) {
        console.error(error);
        
    }
};
