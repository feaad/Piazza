const mongoose = require("mongoose");

//Creating Post schema
const postSchema = mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
	},

	topicId: {
		type: mongoose.Schema.Types.ObjectId,
		max: 24,
		min: 24,
		required: true,
	},

	title: {
		type: String,
		required: true,
		min: 5,
		max: 256,
	},

	message: {
		type: String,
		required: true,
		min: 3,
		max: 280,
	},

	author: {
		type: String,
	},

	likes: {
		type: Number,
		default: 0,
	},

	dislikes: {
		type: Number,
		default: 0,
	},

	comments: {
		type: Number,
		default: 0,
	},

	status: {
		type: String,
		enum: ["Live", "Expired"],
		default: "Live",
	},

	createdOn: {
		type: Date,
		required: true,
		default: Date.now,
	},
	expiresOn: {
		type: Date,
		required: true,
	},
});

module.exports = mongoose.model("posts", postSchema);
