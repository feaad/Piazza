const express = require("express");
const router = express.Router();

const Likes = require("../models/Likes");
const Dislikes = require("../models/Dislikes");
const Posts = require("../models/Posts");
const verifyToken = require("../VerifyToken");


// Update likes for a post
router.post("/:postId", verifyToken, async (req, res) => {
	try {
		const postById = await Posts.findById(req.params.postId);

		// check if post is available, live and the current user is not the
		// author of the post
		if (!postById) {
			return res.status(404).send({ message: "Can not find post" });
		} else if (postById.status === "Expired") {
			return res.status(405).send({ message: "Post has expired" });
		} else if (postById.user_id.toString() === req.user._id) {
			return res.status(405).send({ message: "You can not like your own post" });
		} else {
			const currentUser = req.user;
			const likeCount = await Likes.countDocuments({ postId: postById });
			const dislikeCount = await Dislikes.countDocuments({ postId: postById });

			const postLike = await Likes.findOne({
				postId: postById,
				userId: currentUser._id
			});

			const dislikePost = await Dislikes.findOne({
				postId: postById,
				userId: currentUser,
			});
			if (!postLike) {
				const newLike = new Likes({
					postId: postById,
					userId: currentUser._id,
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
								likes: likeCount + 1
							},
						}
					);

					//Delete dislike if user previously disliked the post
					const postDislike = await Dislikes.findOne({
						postId: postById,
						userId: currentUser._id,
					});
					if (postDislike) {
						await Dislikes.deleteOne({
							_id: dislikePost._id,
						});
						await Posts.updateOne(
							{
								_id: dislikePost.postId,
							},
							{
								$set: {
									dislikes: dislikeCount - 1,
								},
							}
						);
					}

					return res.status(200).send({ message: "Post Liked" });
				} catch (err) {
					res.status(400).send({ message: err });
				}
			}

			//If user clicks like twice, delete like
			else {
				await Likes.deleteOne({
					_id: postLike._id,
				});
				await Posts.updateOne(
					{
						_id: postLike.postId,
					},
					{
						$set: {
							likes: likeCount - 1,
						},
					}
				);
				return res.status(200).send({ message: "Post unliked" });
			}
		}
	} catch (err) {
		res.send({ message: err });
	}
});

module.exports = router;



