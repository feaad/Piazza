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
		currentDate.getTime() + req.body.expiresOn * 60000
	);

	const post = new Posts({
		userId: req.user._id,
		author: username,
		topicId: req.body.topicId,
		title: req.body.title,
		message: req.body.message,
		expiresOn: expiryDate,
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
			userId: 1,
			topicId: 1,
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
		activePost.match({topicId: topic.toString});
	}

	activePost.sort({ total: "desc" }).limit(1);

	activePost
		.project({
			userId: 1,
			status: 1,
			topicId: 1,
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
router.get("/activePost/:topicId", verifyToken, async (req, res) => {
	const ids = req.params.topicId
	const active = await activePost(Posts, ids);
	res.send(active);
});

//Retrieve post with max comments
router.get("/activePostsByComments", verifyToken, async (req, res) => {
	try {
		const commentPost = await Posts.find().sort("-comments").limit(1);
		res.send(commentPost);
	} catch (err) {
		res.send({ message: err });
	}
});

//Retrieve all expired posts
router.get("/history", verifyToken, async (req, res) => {
	try {
		const history = await Posts.aggregate().match({ status: "Expired" })
		res.send(history)
	} catch (err) {
		res.send({ message: err });
	}
});


//Retrieve all expired posts by topic
router.get("/history/:topicId", verifyToken, async (req, res) => {
	try {
		const tId = {
			"$oid": req.params.topicId,
		};
		const historyPost = await Posts.find({ topicId: req.params.topicId }).where('status').equals("Expired")
		res.send(historyPost)
	} catch (err) {
		res.send({ message: err })
	}
});

// Retrieve all topics
router.get("/:topicId", verifyToken, async (req, res) => {
	try {
		const topic = await Posts.find({ topicId: req.params.topicId });
		res.send(topic);
	} catch (err) {
		res.send({ message: err });
	}
});

module.exports = router;
