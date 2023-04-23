const mongoose = require("mongoose");
const { Schema } = mongoose;


const LiveSchema = new Schema({
	
	title         : {
		type     : String,
		required : true
	},
	date      : {
		type     : Date,
		required : true
	},
	location      : {
		type     : String,
		required : true
	},
    description      : {
		type     : String,
		required : true
	},
	liveLink          : {
		type    : String,
		required : false
	},
    user          : {
		type    : Schema.Types.ObjectId,
		ref: 'user'
	},
    participants          : [{
		type    : Schema.Types.ObjectId,
		ref: 'user'
	}],
   
},
{ timestamps: true }
);

module.exports = Live = mongoose.model('live', LiveSchema);