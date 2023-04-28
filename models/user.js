const mongoose = require("mongoose");
const { Schema } = mongoose;

const SoldeSchema = new Schema({
	amount:{
		type: Number,
		default : 0
	},
	currency:{
		type :String,
		default :'USD'

	}
})
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
	company: {
		type: String,
	  },

	solde:[SoldeSchema]
		
	
},
{ timestamps: true }
);

module.exports = User = mongoose.model('user', UserSchema);