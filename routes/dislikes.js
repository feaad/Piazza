const express = require("express");
const router = express.Router();

const Dislikes = require("../models/Dislikes");
const Likes = require("../models/Likes");
const Posts = require("../models/Posts");
const verifyToken = require("../VerifyToken");

// TODO: Use the appropriate http response codes
router.post("/:post_id", verifyToken, async (req, res) => {
	// check if post is available, live and the current user is not the
	// author of the post
	try {
		const postById = await Posts.findById(req.params.post_id);
		//check if status is live
		if (!postById) {
			return res.status(404).send({ message: "Can not find post" });
		} else if (postById.status === "Expired") {
			return res.status(405).send({ message: "Post has expired" });
		} else if (postById.user_id.toString() === req.user._id) {
			return res.status(405).send({ message: "You can not like your own post" });
		} else {
			const currentUser = req.user;
			const dislikeCount = await Dislikes.countDocuments({ post_id: postById });
			const likeCount = await Likes.countDocuments({ post_id: postById });

			const postDislike = await Dislikes.findOne({
				post_id: postById,
				user_id: currentUser._id,
			});

			const likePost = await Likes.findOne({
				post_id: postById,
				user_id: currentUser,
			});

			if (!postDislike) {
				const newDislike = new Dislikes({
					post_id: postById,
					user_id: currentUser._id,
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
						post_id: postById,
						user_id: currentUser._id,
					});

					if (postLike) {
						await Likes.deleteOne({
							_id: likePost._id,
						});
						await Posts.updateOne(
							{
								_id: likePost.post_id,
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
						_id: postDislike.post_id,
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
