const User = require("../models/user");
const crypto = require('crypto');
const secretKey = crypto.randomBytes(64).toString('hex');

var bcrypt = require("bcryptjs");
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

const sgMail = require('@sendgrid/mail');
require('dotenv').config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.signup = async (req, res) => {
  const { lastName, email, password, firstName, imageUrl } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user) {
      return res.status(409).json({
        success: false,
        message: 'An account with that email already exists',
      });
    }

    // Generate a secret key for your encryption
    const secretKey = crypto.randomBytes(64).toString('hex');
    console.log(secretKey);

    const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1d' });
    const userSave = new User({
      lastName,
      email,
      firstName,
      imageUrl,
      password: bcrypt.hashSync(password, 8),
      verificationToken,
    });

    await userSave.save();

    const verificationLink = `${process.env.CLIENT_URL}/verify/${verificationToken}`;

    const msg = {
      to: userSave.email,
      from: 'twinpidev22@gmail.com',
      subject: 'Verify your Inter Donation account',
      html: `<p>Hello ${userSave.firstName} ${userSave.lastName}, please click on the following link to verify your account:</p><p>${verificationLink}</p>`,
    };

    sgMail.send(msg, (error, result) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Verification email sent');
      }
    });

    res.json(userSave);
  } catch (err) {
    res.json(err);
  }
};


exports.signin = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).send('No user found.');
    //check user is active or not
    if (user.verified !== true)
      return res.status(401).send('You are not an verified member');

    // check if the password is valid
    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) return res.status(401).send('Invalid Password');
    var token = jwt.sign({ id: user._id }, 'token');

    res.status(200).send({ user: user, auth: true, accessToken: token, expiresIn: 86400, isLoggedIn: true });


  } catch (err) {

    return res.status(500).send('Internal Server Error' + err.toString());
  }
};
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No user found with that email',
      });
    }

    const resetToken = jwt.sign({ email }, secretKey, { expiresIn: '1h' });

    user.resetToken = resetToken;
    user.resetTokenExpiration = Date.now() + 3600000; // 1 hour
    await user.save();
    const resetLink = `${process.env.CLIENT_URL}/reset/${resetToken}`;

    const msg = {
      to: user.email,
      from: 'twinpidev22@gmail.com', // Replace with your own email address
      subject: 'Password reset request',
      html: `<p>Hello ${user.firstName} ${user.lastName},</p><p>Please click the following link to reset your password:</p><p>${resetLink}</p><p>If you did not request this reset, please ignore this message and your password will remain unchanged.</p>`,
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
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to reset password',
    });
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
  const { password } = req.body;
  const resetToken = req.params.token;

  try {
    const user = await User.findOne({ resetToken });
    if (!user || Date.now() > user.resetTokenExpiration) {
      return res.status(404).json({
        success: false,
        message: 'Invalid or expired reset token',
      });
    }

    user.password = bcrypt.hashSync(password, 8);
    user.resetToken = null;
    user.resetTokenExpiration = null;
    await user.save();

    const msg = {
      to: user.email,
      from: 'twinpidev22@gmail.com', // Replace with your own email address
      subject: 'Password reset confirmation',
      html: `<p>Hello ${user.firstName} ${user.lastName},</p><p>Your password has been successfully reset.</p>`,
    };

    sgMail.send(msg, (error, result) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Password reset confirmation email sent');
      }
    });

    res.status(200).json({
      success: true,
      message: 'Password reset successful',
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to reset password',
    });
  }
};

//Edit profile

exports.editProfile = async (req, res) => {
  try {
  const id = req.body._id
    
  const user = req.body;
        const updatedUser = await User.updateMany(
            { _id: id  },
            { $set: user }

        );

  console.log(updatedUser);
  if (!updatedUser) {
    return res.status(400).send('User not found');
  }

  return res.status(200).send('Account updated successfully');      
} catch (err) {
  console.error(err);
  return res.status(500).send('Internal Server Error');
}
};
