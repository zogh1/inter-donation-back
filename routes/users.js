var express = require('express');
var router = express.Router();
const userController = require('../controllers/user.controller')

router.post('/signup', userController.signup);
router.post('/signin', userController.signin);
router.post('/signinWithFaceId', userController.signinWithFaceId);
router.put('/editProfile', userController.editProfile);

router.get('/:id', userController.getById);



router.post('/forgot-password', userController.forgotPassword);

router.post('/reset-password/:token', userController.resetPassword);
router.get('/verify/:token', async (req, res) => {
    try {
        const token = req.params.token;
        const updatedUser = await User.updateMany(
            { verificationToken: token },
            { $set: { verified: true, verificationToken: null } }

        );
        console.log(updatedUser);
        if (!updatedUser) {
            return res.status(400).send('Invalid token');
        }

        return res.status(200).send('Account verified successfully');
    } catch (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
    }
});




module.exports = router;

