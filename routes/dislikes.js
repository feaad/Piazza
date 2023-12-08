const express = require("express");
const router = express.Router();

const Dislikes = require("../models/Dislikes");
const Likes = require("../models/Likes");
const Posts = require("../models/Posts");
const verifyToken = require("../VerifyToken");

router.post("/:postId", verifyToken, async (req, res) => {
	// check if post is available, live and the current user is not the
	// author of the post
	try {
		const postById = await Posts.findById(req.params.postId);
		//check if status is live
		if (!postById) {
			return res.status(404).send({ message: "Can not find post" });
		} else if (postById.status === "Expired") {
			return res.status(405).send({ message: "Post has expired" });
		} else if (postById.user_id.toString() === req.user._id) {
			return res.status(405).send({ message: "You can not like your own post" });
		} else {
			const currentUser = req.user;
			const dislikeCount = await Dislikes.countDocuments({ postId: postById });
			const likeCount = await Likes.countDocuments({ postId: postById });

			const postDislike = await Dislikes.findOne({
				postId: postById,
				userId: currentUser._id,
			});

			const likePost = await Likes.findOne({
				postId: postById,
				userId: currentUser,
			});

			if (!postDislike) {
				const newDislike = new Dislikes({
					postId: postById,
					userId: currentUser._id,
				});

				try {
					//Add new dislike to Dislikes collection
					await newDislike.save();

					//Update post with the new dislike
					await Posts.updateOne(
						{
							_id: postById,
						},
						{
							$set: {
								dislikes: dislikeCount + 1,
							},
						}
					);
					//Delete like, if user already liked the post
					const postLike = await Likes.findOne({
						postId: postById,
						userId: currentUser._id,
					});

					if (postLike) {
						await Likes.deleteOne({
							_id: likePost._id,
						});
						await Posts.updateOne(
							{
								_id: likePost.postId,
							},
							{
								$set: {
									likes: likeCount - 1,
								},
							}
						);
					}

					return res.status(200).send({ message: "Post Disliked" });
				} catch (err) {
					res.status(400).send({ message: err });
				}
			}
			//If user clicks dislike twice, delete dislike
			else {
				await Dislikes.deleteOne({
					_id: postDislike._id,
				});
				await Posts.updateOne(
					{
						_id: postDislike.postId,
					},
					{
						$unset: {
							dislikes: dislikeCount - 1,
						},
					}
				);
				return res.status(200).send({ message: "Dislike removed" });
			}
		}
	} catch (err) {
		res.send({ message: err });
	}
});

module.exports = router;
