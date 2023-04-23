// controllers/donationController.js

const DonationRequest = require('../models/Donation');
const upload = require('../middleware/Multer');
const User = require('../models/user'); // import User schema file
const sgMail = require('@sendgrid/mail');

// Function for creating a new donation request
exports.createDonationRequest = async (req, res) => {
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
            currency
        });

        // Upload the media file using multer and add the file path to the donation request object
        const url = req.protocol + '://' + req.get('host');
        console.log('++++++', url)
        if (req.file != undefined) {
            console.log("------------------------------")
            console.log("------------------------------")
            newDonationRequest.media = url + '/public/uploads/' + req.file.filename
        }
        try {
            const savedDonationRequest = await newDonationRequest.save();
            res.json(savedDonationRequest)

        }
        catch (error) {
            console.log("error :", error)
            res.json(error)
        }


    })
};
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
        const donationId = req.params.donationId;
        const helperId = req.params.helperId;
        const amount = req.params.amount;
        const byMatching = req.params.byMatching;

        // get the donation by donation id
        const donation = await Donation.findById(donationId);

        if (!donation) {
            return res.status(404).json({ error: 'Donation not found' });
        }

        // get the user by helper id
        const helperUser = await User.findById(helperId);

        if (!helperUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        const totalAmount = donation.helpers.reduce((totalAmount, helper) => {
            return totalAmount + helper.amount;
        }, 0);
        const neededAmount = donation.amount - totalAmount;
        console.log('amount : ', amount, ' total amount : ', totalAmount, ' needed amount : ', neededAmount)
        if (amount > neededAmount) {
            amount = neededAmount;
        }

        // add the helper to donation helpers
        const helper = {
            user: helperUser._id,
            amount,
            ByMatching: byMatching
        };

        if (amount > 0) {
            donation.helpers.push(helper);
            await donation.save();


            if (byMatching == 'false') {
                // send emails to users from the same company as the donor
                const donorUser = await User.findById(donation.user);

                const usersInSameCompany = await User.find({ company: donorUser.company });

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
                                <a href="http://localhost:3000/cause-details/${req.params.donationId}/true">Donate</a>
                              </body>
                            </html>`,
                        };
                        sgMail.send(msg, (error, result) => {
                            if (error) {
                                console.log(error);
                                res.status(500).json({
                                    success: false,
                                    message: 'Failed to send reset email',
                                });
                            } else {
                                console.log('Password reset email sent');
                                res.status(200).json({
                                    success: true,
                                    message: 'Password reset email sent',
                                });
                            }
                        });
                    });

                await Promise.all(emailPromises);
            }
            res.status(201).json({ message: 'Helper added successfully' });
        }
        else {

            res.status(200).json({ message: 'donnation expired' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
