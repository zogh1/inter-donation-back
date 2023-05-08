const User = require("../models/user");
const crypto = require('crypto');
const secretKey = crypto.randomBytes(64).toString('hex');
console.log(secretKey);
var bcrypt = require("bcryptjs");
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

const sgMail = require('@sendgrid/mail');
require('dotenv').config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.signup = async (req, res) => {
  const { lastName, email, password, firstName,role ,faceId} = req.body;
  console.log(lastName, email, password, firstName,role );
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
   

    const verificationToken = jwt.sign({ email }, secretKey, { expiresIn: '1d' });
    const userSave = new User({
      lastName:lastName,
      email:email,
      firstName: firstName,
      imageUrl:"",
      password:bcrypt.hashSync(password, 8),
      code:verificationToken,
      role:role,
      faceId:faceId,
      solde:[{amount:0, currency:'USD'}]
      
    });
    console.log(userSave);
    userSave.save();
   
   

    const verificationLink = `${process.env.CLIENT_URL}/verify/${verificationToken}`;

    const msg = {
      to: userSave.email,
      from: 'twinpidev22@gmail.com',
      subject: 'Verify your Inter Donation account',
      html: `<!doctype html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
          <title>Simple Transactional Email</title>
          <style>
            /* -------------------------------------
                GLOBAL RESETS
            ------------------------------------- */
            
            /*All the styling goes here*/
            
            img {
              border: none;
              -ms-interpolation-mode: bicubic;
              max-width: 100%; 
            }
      
            body {
              background-color: #f6f6f6;
              font-family: sans-serif;
              -webkit-font-smoothing: antialiased;
              font-size: 14px;
              line-height: 1.4;
              margin: 0;
              padding: 0;
              -ms-text-size-adjust: 100%;
              -webkit-text-size-adjust: 100%; 
            }
      
            table {
              border-collapse: separate;
              mso-table-lspace: 0pt;
              mso-table-rspace: 0pt;
              width: 100%; }
              table td {
                font-family: sans-serif;
                font-size: 14px;
                vertical-align: top; 
            }
      
            /* -------------------------------------
                BODY & CONTAINER
            ------------------------------------- */
      
            .body {
              background-color: #f6f6f6;
              width: 100%; 
            }
      
            /* Set a max-width, and make it display as block so it will automatically stretch to that width, but will also shrink down on a phone or something */
            .container {
              display: block;
              margin: 0 auto !important;
              /* makes it centered */
              max-width: 580px;
              padding: 10px;
              width: 580px; 
            }
      
            /* This should also be a block element, so that it will fill 100% of the .container */
            .content {
              box-sizing: border-box;
              display: block;
              margin: 0 auto;
              max-width: 580px;
              padding: 10px; 
            }
      
            /* -------------------------------------
                HEADER, FOOTER, MAIN
            ------------------------------------- */
            .main {
              background: #ffffff;
              border-radius: 3px;
              width: 100%; 
            }
      
            .wrapper {
              box-sizing: border-box;
              padding: 20px; 
            }
      
            .content-block {
              padding-bottom: 10px;
              padding-top: 10px;
            }
      
            .footer {
              clear: both;
              margin-top: 10px;
              text-align: center;
              width: 100%; 
            }
              .footer td,
              .footer p,
              .footer span,
              .footer a {
                color: #999999;
                font-size: 12px;
                text-align: center; 
            }
      
            /* -------------------------------------
                TYPOGRAPHY
            ------------------------------------- */
            h1,
            h2,
            h3,
            h4 {
              color: #000000;
              font-family: sans-serif;
              font-weight: 400;
              line-height: 1.4;
              margin: 0;
              margin-bottom: 30px; 
            }
      
            h1 {
              font-size: 35px;
              font-weight: 300;
              text-align: center;
              text-transform: capitalize; 
            }
      
            p,
            ul,
            ol {
              font-family: sans-serif;
              font-size: 14px;
              font-weight: normal;
              margin: 0;
              margin-bottom: 15px; 
            }
              p li,
              ul li,
              ol li {
                list-style-position: inside;
                margin-left: 5px; 
            }
      
            a {
              color: #3498db;
              text-decoration: underline; 
            }
      
            /* -------------------------------------
                BUTTONS
            ------------------------------------- */
            .btn {
              box-sizing: border-box;
              width: 100%; }
              .btn > tbody > tr > td {
                padding-bottom: 15px; }
              .btn table {
                width: auto; 
            }
              .btn table td {
                background-color: #ffffff;
                border-radius: 5px;
                text-align: center; 
            }
              .btn a {
                background-color: #ffffff;
                border: solid 1px #3498db;
                border-radius: 5px;
                box-sizing: border-box;
                color: #3498db;
                cursor: pointer;
                display: inline-block;
                font-size: 14px;
                font-weight: bold;
                margin: 0;
                padding: 12px 25px;
                text-decoration: none;
                text-transform: capitalize; 
            }
      
            .btn-primary table td {
              background-color: #3498db; 
            }
      
            .btn-primary a {
              background-color: #3498db;
              border-color: #3498db;
              color: #ffffff; 
            }
      
            /* -------------------------------------
                OTHER STYLES THAT MIGHT BE USEFUL
            ------------------------------------- */
            .last {
              margin-bottom: 0; 
            }
      
            .first {
              margin-top: 0; 
            }
      
            .align-center {
              text-align: center; 
            }
      
            .align-right {
              text-align: right; 
            }
      
            .align-left {
              text-align: left; 
            }
      
            .clear {
              clear: both; 
            }
      
            .mt0 {
              margin-top: 0; 
            }
      
            .mb0 {
              margin-bottom: 0; 
            }
      
            .preheader {
              color: transparent;
              display: none;
              height: 0;
              max-height: 0;
              max-width: 0;
              opacity: 0;
              overflow: hidden;
              mso-hide: all;
              visibility: hidden;
              width: 0; 
            }
      
            .powered-by a {
              text-decoration: none; 
            }
      
            hr {
              border: 0;
              border-bottom: 1px solid #f6f6f6;
              margin: 20px 0; 
            }
      
            /* -------------------------------------
                RESPONSIVE AND MOBILE FRIENDLY STYLES
            ------------------------------------- */
            @media only screen and (max-width: 620px) {
              table.body h1 {
                font-size: 28px !important;
                margin-bottom: 10px !important; 
              }
              table.body p,
              table.body ul,
              table.body ol,
              table.body td,
              table.body span,
              table.body a {
                font-size: 16px !important; 
              }
              table.body .wrapper,
              table.body .article {
                padding: 10px !important; 
              }
              table.body .content {
                padding: 0 !important; 
              }
              table.body .container {
                padding: 0 !important;
                width: 100% !important; 
              }
              table.body .main {
                border-left-width: 0 !important;
                border-radius: 0 !important;
                border-right-width: 0 !important; 
              }
              table.body .btn table {
                width: 100% !important; 
              }
              table.body .btn a {
                width: 100% !important; 
              }
              table.body .img-responsive {
                height: auto !important;
                max-width: 100% !important;
                width: auto !important; 
              }
            }
      
            /* -------------------------------------
                PRESERVE THESE STYLES IN THE HEAD
            ------------------------------------- */
            @media all {
              .ExternalClass {
                width: 100%; 
              }
              .ExternalClass,
              .ExternalClass p,
              .ExternalClass span,
              .ExternalClass font,
              .ExternalClass td,
              .ExternalClass div {
                line-height: 100%; 
              }
              .apple-link a {
                color: inherit !important;
                font-family: inherit !important;
                font-size: inherit !important;
                font-weight: inherit !important;
                line-height: inherit !important;
                text-decoration: none !important; 
              }
              #MessageViewBody a {
                color: inherit;
                text-decoration: none;
                font-size: inherit;
                font-family: inherit;
                font-weight: inherit;
                line-height: inherit;
              }
              .btn-primary table td:hover {
                background-color: #34495e !important; 
              }
              .btn-primary a:hover {
                background-color: #34495e !important;
                border-color: #34495e !important; 
              } 
            }
      
          </style>
        </head>
        <body>
          <span class="preheader">This is preheader text. Some clients will show this text as a preview.</span>
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body">
            <tr>
              <td>&nbsp;</td>
              <td class="container">
                <div class="content">
      
                  <!-- START CENTERED WHITE CONTAINER -->
                  <table role="presentation" class="main">
                 <img src="https://static.vecteezy.com/system/resources/previews/004/327/957/original/donation-box-throwing-coin-in-a-box-for-donations-donate-giving-money-and-love-concept-of-charity-give-and-share-your-love-with-people-vector.jpg"/>
                    <!-- START MAIN CONTENT AREA -->
                    <tr>
                      <td class="wrapper">
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                          <tr>
                            <td>
                              <p>Hi ${firstName} ${lastName},</p>
                              <p>Thank you for you subscription on Inter Donation</p>
                              <p>Please verify your account by clicking on this button</p>
                             
                              <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary">
                                <tbody>
                                  <tr>
                                    <td align="left">
                                      <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                        <tbody>
                                          <tr>
                                            <td> <a href="${verificationLink}" target="_blank">Verify my account</a> </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            
                          
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
      
                  <!-- END MAIN CONTENT AREA -->
                  </table>
                  <!-- END CENTERED WHITE CONTAINER -->
      
                  <!-- START FOOTER -->
                  <div class="footer">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td class="content-block">
                          <span class="apple-link">Company Inc, 3 Abbey Road, San Francisco CA 94102</span>
                          <br> Don't like these emails? <a href="http://i.imgur.com/CScmqnj.gif">Unsubscribe</a>.
                        </td>
                      </tr>
                      <tr>
                        <td class="content-block powered-by">
                          Powered by <a href="http://htmlemail.io">HTMLemail</a>.
                        </td>
                      </tr>
                    </table>
                  </div>
                  <!-- END FOOTER -->
      
                </div>
              </td>
              <td>&nbsp;</td>
            </tr>
          </table>
        </body>
      </html>`,
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
            return res.status(200).send('You are not an verified member');

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
  const { resetToken, password } = req.body;

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
exports.signinWithFaceId =  (req, res) => {
  try {
    console.log(req.body.faceId);
      let user =  User.findOne({ faceId: req.body.faceId }).then(user=>{
        console.log(user)
if(user){
  var token = jwt.sign({ id: user._id }, 'token');
      
  res.status(200).send({ user: user, auth: true, accessToken: token, expiresIn: 86400, isLoggedIn: true });
}
if (user.verified !== true)
return res.status(200).send('You are not an verified member');
if (!user) return res.status(200).send('No user found.');
      });
    
   
     
      //check user is active or not


      // check if the password is valid
 

      
     
  } catch (err) {
     
      return res.status(500).send('Internal Server Error' + err.toString());
  }
};
exports.editProfile = async (req, res) => {
  // upload.single('imageUrl')(req, res,async function (error) {
   try {
   const id = req.body._id
 
   const user = await User.findOne({ _id:id });
     
   
 
 
     
   var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
   if (!passwordIsValid) return res.status(200).send('Invalid actual Password');
 
   const userData = req.body;
 
   userData.password=bcrypt.hashSync(userData.newPass, 8)
         const updatedUser = await User.updateMany(
             { _id: id  },
             { $set: userData }
 
         );
 
 
   if (!updatedUser) {
     return res.status(200).send('User not found');
   }
 
   return res.status(200).send({success:true});      
 } catch (err) {
   console.error(err);
   return res.status(500).send('Internal Server Error'+err);
 }
  // })
 };


 exports.getById =async (req,res)=>{
  id=req.params.id
  const user = await User.findOne({ _id:id });
  return res.status(200).send(user);

};

// exports.afficheUsers=async(req, res)=>{
//   try {
//     const u= User.find()
//     .then(response=>{return res.json(response)})
//     console.log(u);
//   } catch (error) {
//     console.log(e)
//   }
// };   

