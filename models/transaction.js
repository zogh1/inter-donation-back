const mongoose = require("mongoose");
const { Schema } = mongoose;

const TransactionSchema = new Schema({
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    to: {
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

	}}  ,
 
{ timestamps: true }
)

module.exports = Transaction = mongoose.model('transaction', TransactionSchema);