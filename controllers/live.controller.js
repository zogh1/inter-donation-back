const Live = require("../models/live");


exports.addLive = async (req, res) => {
    const { title, date, location, description, user } = req.body;

    if (!title || !date || !location|| !description|| !user) {
        return res.status(400).send({ message: "Missing fields" });
      }

      try {
        const live = await Live.create({
          
          title,
          date,
          location,
          description,
          
          user,
        });

       

  
        
        return res.status(200).json({ message: "Live added successfully!" ,live});
      } catch (err) {
        
        return res.status(500).json({ message: err.message });
      }
}


exports.getLives = async (req, res) => {
    

      try {
       const lives = await Live.find({}).populate("user").populate("participants").sort({ createdAt: -1 }).lean();
  
        
       return res.status(200).json({
        message: `Successfully got lives!`,
        lives: lives,
      });
      } catch (err) {
        
        return res.status(500).json({ message: err.message });
      }
}

exports.getLive = async (req, res) => {
    

    try {
        let live = await Live.findOne({
            _id: req.params.id,
          }).populate("user").lean();
          var today = new Date(live.date);

          // Getting full month name (e.g. "June")
          var month = today.toLocaleTimeString();
          console.log(month);
          return res.status(200).json({
            message: `Got live successfully!`,
            live,
          });
    } catch (err) {
      
      return res.status(500).json({ message: err.message });
    }
}

exports.editLive = async (req, res) => {
    

    try {
        let live =   await Live.updateOne(
            { _id: req.body.id },
            {
          title:req.body.title,
          date:req.body.date,
          location:req.body.location,
          description:req.body.description,
            }
          );
      
          
          return res.status(200).json({ message: `Live updated successfully!`,live });
    } catch (err) {
      
      return res.status(500).json({ message: err.message });
    }
}

exports.deleteLive = async (req, res) => {
    

    try {
        const response = await Live.deleteMany({ _id: req.body.id});
        
    
        return res.status(200).json({
          message: `Successfully deleted `,
        });
    } catch (err) {
      
      return res.status(500).json({ message: err.message });
    }
}



exports.participate = async (req, res) => {
    

  try {
      let live =   await Live.findByIdAndUpdate(
        req.body.liveId,
        { $push: { participants: req.body.userId } },
        { new: true, useFindAndModify: false }
      );
    
        
        return res.status(200).json({ message: `Participate successfully!`,live });
  } catch (err) {
    
    return res.status(500).json({ message: err.message });
  }
}

exports.checkParticipation = async (req, res) => {
    const userId=req.params.userId;
    const liveId=req.params.liveId;
    if (liveId === 'favicon.ico' ) {
      return; // skip query and return early
    }
  try {
      Live.find({ _id: liveId, participants: userId }, (err, result) => {
          if (err) {
            console.error(err);
          } else {
            if (result.length > 0) {
              
              return res.status(200).json({
                status:true
              });
            } else {
              return res.status(200).json({
                status:false
              });
            }
          }
        })
  } catch (err) {
    
    return res.status(500).json({ message: err.message });
  }
}