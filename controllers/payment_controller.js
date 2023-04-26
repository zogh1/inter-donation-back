const COINBASE_API_KEY='f140ef76-6dba-4b10-b6e9-9d671b2cf58b';
const COINBASE_WEBHOOK_SECRET='5a9ab4cc-f1d3-4429-974e-183dc588e72d'
const DOMAIN='http://localhost:3000'
const { Client , resources ,  Webhook } = require('coinbase-commerce-node')  
const { Charge } = resources;
const Donation = require('../models/Donation');
const User = require("../models/user");
const Transaction=require('../models/transaction');
const Withdraw=require('../models/withdraw');
const mongoose = require("mongoose");
//const { ObjectId } = mongoose.Types;
const sgMail = require('@sendgrid/mail');
const handlebars = require('handlebars');
const fs = require('fs');
Client.init(COINBASE_API_KEY);
exports.create_charges = async (req, res) => {
    const chargeData  = {
        name : "Inter Donation",
        description : 'Donation',
        local_price : {
            amount : req.params.amount,
            currency: req.params.currency
        },
        pricing_type : 'fixed_price',
        metadata: {
            helper_id: req.params.user_id,
            donation:req.params.donation_id,
            amount:req.params.amount
           
        },
        redirect_url: `${DOMAIN}/success-payment`,
        cancel_url: `${DOMAIN}/exchange/${req.params.donation_id}`, 
    }
    const charge = await Charge.create(chargeData);

        res.send(charge);  

}

exports.verify_payment = async (req, res) => {
    const rawBody = req.body;
    const signature = req.headers["x-cc-webhook-signature"];
    const webhookSecret = COINBASE_WEBHOOK_SECRET;
    const byMatching = false
  
    let event;
  
    try {
      event = Webhook.verifyEventBody(JSON.stringify(rawBody), signature, webhookSecret);
      
  
      if (event.type === "charge:created") {
        // received order
        // user paid, but transaction not confirm on blockchain yet
       
        const amount = event.data.metadata.amount;
        const donation_id = event.data.metadata.donation;
       
        const helper_id = event.data.metadata.helper_id;
  

 
    

    try{
        const donation =await Donation.findById(donation_id).populate('user').exec();
        const helper= await User.findById(helper_id);
        if(donation && helper && amount){
                //calcul of fees
                const fees =parseFloat(amount)/100
                const newAmount=amount-fees;
           donation.helpers.push( { user: helper._id,
                amount :newAmount,ByMatching: false});
            await donation.save();
            const receiver= donation.user;
            const receiver_solde=receiver.solde;
            const soldeWithCurrency = receiver_solde.find(s => s.currency === donation.currency);
            if(soldeWithCurrency){
                //append amount
                const previousSolde =soldeWithCurrency.amount;
                soldeWithCurrency.amount=previousSolde+newAmount;
                await receiver.save();
            }else{
                const newSolde={
                    currency:donation.currency,
                    amount:newAmount
                }
                receiver.solde.push(newSolde);
                await receiver.save();

                console.log(receiver);

              
            }
            const trans= new Transaction({
                from:helper_id,
                to:receiver._id,
                amount:newAmount,
                currency:donation.currency


            });
            await trans.save();
            
            const data = {
                firstName: receiver.firstName,
                lastName: receiver.lastName,
                amount: newAmount,
                currency:donation.currency,
                sender: `${helper.firstName} ${helper.lastName}`
              };
              const source = fs.readFileSync('public/template.hbs', 'utf8');
              const template = handlebars.compile(source);
              const html = template(data);
              const msg = {
                to: receiver.email,
                from: 'twinpidev22@gmail.com',
                subject: 'Donation Done',
                html:html}

              sgMail.send(msg, (error, result) => {
                if (error) {
                  console.log(error);
                } else {
                  console.log('Sent.');
                }
              });
            
              try {
                console.log(req.params)
                const donationId = req.params.donationId;
                const helperID = req.params.helperId;
         
                const amount = event.data.metadata.amount;
             
              
          
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
            res.json({success:true});

       
        }else{
          res.send(`success`);
        }
    }
    catch(e){
        res.json(e);
    }
        
      }
  
      if (event.type === "charge:confirmed") {
        // fulfill order
        // charge confirmed
        console.log("charge confirme");
      }
  
      if (event.type === "charge:failed") {
        // cancel order
        // charge failed or expired
        console.log("charge failed");
      }
  
   
    } catch (error) {
      console.log(error);
      console.log(error)
      res.status(400).send(error);
    }
  };


exports.success_payment= async(req,res) =>{
    const donation_id = req.body.donation_id;
    const helper_id = req.body.helper_id;
    const amount = req.body.amount;
 
    

    try{
        const donation =await Donation.findById(donation_id).populate('user').exec();
        const helper= await User.findById(helper_id);
        if(donation && helper && amount){
                //calcul of fees
                const fees =parseFloat(amount)/100
                const newAmount=amount-fees;
           donation.helpers.push( { user: helper._id,
                amount :newAmount});
            await donation.save();
            const receiver= donation.user;
            const receiver_solde=receiver.solde;
            const soldeWithCurrency = receiver_solde.find(s => s.currency === donation.currency);
            if(soldeWithCurrency){
                //append amount
                const previousSolde =soldeWithCurrency.amount;
                soldeWithCurrency.amount=previousSolde+newAmount;
                await receiver.save();
            }else{
                const newSolde={
                    currency:donation.currency,
                    amount:newAmount
                }
                receiver.solde.push(newSolde);
                await receiver.save();

                console.log(receiver);

              
            }
            const trans= new Transaction({
                from:helper_id,
                to:receiver._id,
                amount:newAmount,
                currency:donation.currency


            });
            await trans.save();
            
            const data = {
                firstName: receiver.firstName,
                lastName: receiver.lastName,
                amount: newAmount,
                currency:donation.currency,
                sender: `${helper.firstName} ${helper.lastName}`
              };
              const source = fs.readFileSync('public/template.hbs', 'utf8');
              const template = handlebars.compile(source);
              const html = template(data);
              const msg = {
                to: receiver.email,
                from: 'twinpidev22@gmail.com',
                subject: 'Donation Done',
                html:html}

              sgMail.send(msg, (error, result) => {
                if (error) {
                  console.log(error);
                } else {
                  console.log('Sent.');
                }
              });
            


            res.json({success:true});

       
        }
    }
    catch(e){
        res.json(e);
    }
}
exports.withdraw= async (req,res) =>{
        try{
            const user=req.body.user_id;
            const amount= req.body.amount;
            const currency=req.body.currency;
            const wallet= req.body.wallet;
       
            if(!user || !amount || !currency || !wallet){
                return res.send({success:false , message:'required fields'});
            }
            const verify= await Withdraw.findOne({user:user , status:'pending'});
            console.log(verify);
            if(!verify){
                const today = new Date();
                const twoDaysFromNow = new Date(today);
                twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2);
                
                if (twoDaysFromNow.getDay() === 6 /* Saturday */) {
                  twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2);
                } else if (twoDaysFromNow.getDay() === 0 /* Sunday */) {
                  twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 1);
                }
                const withdraw=new Withdraw({
                  user:user,
                  amount:amount,
                  currency:currency,
                  processing_date:twoDaysFromNow,
                  wallet:wallet
            
                });
                User.findByIdAndUpdate(user, { $inc: { 'solde.$[elem].amount': -amount } }, { 
                    arrayFilters: [ { 'elem.currency': currency } ], 
                    new: true 
                  }, (err, user) => {
                    if (err) {
                      console.log(err);
                    } else {
                      console.log(user);
                    }
                  });
              
             
                await withdraw.save();
               return res.json({withdraw , success:true});
            }else{
                return res.send({success:false , message:"you have already an withdraw request pending!"});
            }     

        }catch(e){
            return res.send({success:false , message:`${e}`});
        }


    }
    
    exports.withdraw_by_user= async (req,res) =>{
        try{
            const user_id=req.params.user_id;
         
            const withdraw= await Withdraw.find({user:user_id});
            res.send({withdraw , success:true} )
        }catch(e){
            res.send({success:false});
        }
    }
    exports.withdraws= async (req,res) =>{
        try{
            const withdraw= await Withdraw.find({status:'pending'});
            res.send({withdraw , success:true} )
        }catch(e){
            res.send({success:false});
        }
    }
    
exports.donate = async (req, res) => {
 
};
   



