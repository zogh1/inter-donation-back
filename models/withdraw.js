const mongoose = require("mongoose");
const { Schema } = mongoose;

const WithdrawSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
	amount:{
		type: Number,
        required: true
	},
	currency:{
		type :String,
        required: true

	},
    processing_date :{
        type :Date,
        required: true
    },
    wallet:{
        type:String,
        required: true
    },
    status:{
        type:String,
        required: true,
        default:'pending'
    }

}  ,
    
 
{ timestamps: true }
)

module.exports = Withdraw = mongoose.model('withdraw', WithdrawSchema);