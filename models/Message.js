const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
	{
		conversation_id: {
			type: String,
		},
		sender_id: {
			type: String,
		},
		text: {
			type: String,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Message", MessageSchema);
