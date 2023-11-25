const express = require("express");
const router = express.Router();

const Posts = require("../models/Posts");
const Likes = require("../models/Likes");

const verifyToken = require("../VerifyToken");
const User = require("../models/User");

const { postValidation } = require("../validations/validations");


router.post("/", verifyToken, async (req, res) => {
	const { error } = postValidation(req.body);
	if (error) {
		return res.status(400).send(error["details"][0]["message"]);
	}

	//Retrieve user id and username
	const getUserById = await User.findById(req.user._id);
	const username = getUserById.username;

	//Set the expiry date according to time
	const currentDate = new Date();
	const expiryDate = new Date(
		currentDate.getTime() + req.body.expires_on * 60000
	);

	const post = new Posts({
		user_id: req.user._id,
		author: username,
		topic_id: req.body.topic_id,
		title: req.body.title,
		message: req.body.message,
		expires_on: expiryDate,
	});

	//Save the new post in the database
	try {
		const savePost = await post.save();
		res.send(savePost);
	} catch (err) {
		res.send({ message: err });
	}
});

//Retrieve all posts
router.get("/", verifyToken, async (req, res) => {
	try {
		const posts = await Posts.find();
		res.send(posts);
	} catch (err) {
		res.send({ message: err });
	}
});

//Retrieve post with max dislikes
router.get("/activePostsByDislikes", verifyToken, async (req, res) => {
	try {
		const test = await Posts.find().sort("-dislikes").limit(1);
		res.send(test);
	} catch (err) {
		res.send({ message: err });
	}
});

//Retrieve post with max likes
router.get("/activePostsByLikes", verifyToken, async (req, res) => {
	try {
		const test = await Posts.find().sort("-likes").limit(1);
		res.send(test);
	} catch (err) {
		res.send({ message: err });
	}
});

//Function to calculate and sort likes and dislikes
async function activePost(param, topic) {
	topic = topic || ""
	const activePost = param.aggregate()
		.project({
			user_id: 1,
			topic_id: 1,
			status: 1,
			title: 1,
			message: 1,
			likes: 1,
			dislikes: 1,
			author: 1,
			comment: 1,
			total: { $add: ["$likes", "$dislikes"] },
		})
	
	if (topic !== "") {
		activePost.match({topic_id: topic.toString} );
	}

	activePost.sort({ total: "desc" }).limit(1);

	activePost
		.project({
			user_id: 1,
			status: 1,
			topic_id: 1,
			title: 1,
			message: 1,
			likes: 1,
			dislikes: 1,
			author: 1,
		})
		.catch((error) => console.log(error));
	return activePost;
}

//Find the most active Posts
router.get("/activePost", verifyToken, async (req, res) => {
	const active = await activePost(Posts);
	res.send(active);
});

//Find the most active Post, filtered by topic
router.get("/activePost/:topic_id", verifyToken, async (req, res) => {
	const ids = req.params.topic_id
	const active = await activePost(Posts, ids);
	res.send(active);
});

//Retrieve post with max comments
router.get("/activePostsByComments", verifyToken, async (req, res) => {
	try {
		const test = await Posts.find().sort("-comments").limit(1);
		res.send(test);
	} catch (err) {
		res.send({ message: err });
	}
});

//Retrieve all expired posts
router.get("/history", verifyToken, async (req, res) => {
	try {
		const history = await Posts.find().sort("Expired");
		res.send(history);
	} catch (err) {
		res.send({ message: err });
	}
});

//Retrieve all expired posts by topic
router.get("/history/:topic_id", verifyToken, async (req, res) => {
	try {
		const historyPost = await Posts.find({
			topic_id: req.params.topic_id
		}).sort("Expired");
		res.send(historyPost)

	} catch (err) {
		res.send({message:err})
	}
})




// Retrieve all topics
router.get("/:topic_id", verifyToken, async (req, res) => {
	try {
		const topic = await Posts.find({ topic_id: req.params.topic_id });
		res.send(topic);
	} catch (err) {
		res.send({ message: err });
	}
});

module.exports = router;
