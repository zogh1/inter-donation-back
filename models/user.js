const mongoose = require("mongoose");
const { Schema } = mongoose;


const UserSchema = new Schema({
	
	email         : {
		type     : String,
		required : true
	},
	password      : {
		type     : String,
		required : true
	},
	firstName      : {
		type     : String,
		required : true
	},
    lastName      : {
		type     : String,
		required : true
	},
	role          : {
		type    : String,
		default : 'user'
	},
    imageUrl          : {
		type    : String,
		required : false
	},
    code          : {
		type    : String,
		required : false
	},
    verified          : {
		type    : Boolean,
		default : false
	},

	faceId:{
		type:String,
		default : null
	},
	identityVerified: {
		type: Boolean,
		default: false
	  },
	company: {
		type: String,
	  },

	solde:[SoldeSchema]
	,
	company: {
		type: String,
	  },
	
},


{ timestamps: true }
);

module.exports = User = mongoose.model('user', UserSchema);