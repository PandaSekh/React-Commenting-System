import AddComment from "../AddComment/AddCommentForm";
import { Fragment, useState } from "react";
import CommentImage from "./CommentImage";
import ReactionBlock from "../Emoji/ReactionBlock";

export default function Comment({ comment, firstParentId }) {
	const [showReplyBox, setShowReplyBox] = useState(false);

	const toggleReplyBox = () => setShowReplyBox(!showReplyBox);

	const formatDate = fullDate => {
		const date = fullDate?.split("T")[0];
		const year = date.split("-")[0];
		const month = new Date(date).toLocaleDateString("default", {
			month: "long",
		});
		const day = date.split("-")[2];

		return `${day} ${month} ${year}`;
	};

	return (
		<li
			key={comment._id}
			id={comment._id}
			className={firstParentId ? "child" : ""}
		>
			<span className="comment-info-container">
				<CommentImage
					image={comment.userImage}
					username={comment.name}
				/>
				<span className="comment-info">
					Comment by <strong>{comment.name}</strong> on{" "}
					<strong>{formatDate(comment._createdAt)}</strong>
				</span>
			</span>
			<p className="comment-content">{comment.comment.trim()}</p>
			<div className="reaction-div">
				<button onClick={toggleReplyBox} className="reply-button">
					Reply
				</button>
				<ReactionBlock
					reactions={comment.reactions}
					commentId={comment._id}
					firstParentId={firstParentId}
				/>
			</div>
			{showReplyBox && (
				<Fragment>
					<AddComment
						parentCommentId={comment._id}
						firstParentId={firstParentId || comment._id}
					/>
				</Fragment>
			)}

			{comment.childComments && (
				<ul>
					{comment.childComments.map(childComment => (
						<Comment
							comment={childComment}
							key={childComment._id}
							firstParentId={firstParentId || comment._id}
						/>
					))}
				</ul>
			)}
		</li>
	);
}
