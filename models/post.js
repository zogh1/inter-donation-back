var mongoose = require('mongoose');
const user = require('./user');
var Schema = mongoose.Schema;

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

		
	
},
{ timestamps: true }
);

var post = new Schema({

    user : {
        type : Schema.Types.ObjectId,
        ref :'user'
    },
    ////
   

    text : {
        type : String, 
        required: true
    },
    subject : {
        type : String, 
        required: true
    },
    PostImage : {
        type : String, 
        required: false
    },



    likes : {
        type : [UserSchema],
        default :[],
        date : {
            type: Date,
            default : Date.now
        },
    },

    comments : [
       {
            user : {
                type : UserSchema,
                ref :'users'
            },

            text : {
                type : String, 
                required: true
            },
            
            date : {
                type: Date,
                default : Date.now
            },
       }    
    ],
    date : {
        type: Date,
        default : Date.now
    }  
    
});

module.exports = mongoose.model('post', post);