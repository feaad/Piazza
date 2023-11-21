const express = require("express");
const router = express.Router();

const Likes = require("../models/Likes");
const Dislikes = require("../models/Dislikes");
const Posts = require("../models/Posts");
const verifyToken = require("../VerifyToken");

// TODO: Use the appropriate http response codes
// Update likes for a post
//things to do -> author of post can not like
//sending a like when already liked deletes the like
router.post("/:post_id", verifyToken, async (req, res) => {
	try {
		const postById = await Posts.findById(req.params.post_id);

		//check if status is live
		if (!postById) {
			return res.status(400).send({ message: "Can not find post" });
		} else if (postById.status === "Expired") {
			return res.status(405).send({ message: "Post has expired" });
		} else if (postById.user_id.toString() === req.user._id) {
			return res
				.status(400)
				.send({ message: "You can not like your own post" });
		} else {
			const currentUser = req.user;
			const likeCount = await Likes.countDocuments({ post_id: postById });
			const dislikeCount = await Dislikes.countDocuments({ post_id: postById });
			const postLike = await Likes.findOne({
				post_id: postById,
				user_id: currentUser._id,
			});

			const dislikePost = await Dislikes.findOne({
				post_id: postById,
				user_id: currentUser,
			});
			if (!postLike) {
				const newLike = new Likes({
					post_id: postById,
					user_id: currentUser._id,
				});
				try {
					//Add new like to Likes collection
					await newLike.save();

					//Update post with the new like
					await Posts.updateOne(
						{
							_id: postById,
						},
						{
							$set: {
								likes: likeCount + 1,
								// dislikes: dislikeCount - 1
							},
						}
					);

					//Delete dislike if user previously disliked the post
					const postDislike = await Dislikes.findOne({
						post_id: postById,
						user_id: currentUser._id,
					});
					if (postDislike) {
						await Dislikes.deleteOne({
							_id: dislikePost._id,
						});
						await Posts.updateOne(
							{
								_id: dislikePost.post_id,
							},
							{
								$set: {
									dislikes: dislikeCount - 1,
								},
							}
						);
					}

					return res.status(200).send({ message: "Like added" });
				} catch (err) {
					res.status(400).send({ message: err });
				}
			}

			//if the post has been liked already, delete the like
			else {
				await Likes.deleteOne({
					_id: postLike._id,
				});
				await Posts.updateOne(
					{
						_id: postLike.post_id,
					},
					{
						$set: {
							likes: likeCount - 1,
						},
					}
				);
				return res.status(200).send({ message: "Like removed" });
			}
		}
	} catch (err) {
		res.send({ message: err });
	}
});

module.exports = router;
