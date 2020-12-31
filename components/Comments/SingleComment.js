import AddComment from "../AddComment/AddCommentForm";
import { Fragment, useState } from "react";
import CommentImage from "./CommentImage";

export default function Comment({ comment, firstParentId }) {
	const [showReplyBox, setShowReplyBox] = useState(false);

	const toggleReplyBox = () => setShowReplyBox(!showReplyBox);

	return (
		<li
			key={comment._id}
			id={comment._id}
			className={firstParentId ? "child" : ""}
		>
			<span>
				<CommentImage image={comment.userImage} />
				Comment by <strong>{comment.name}</strong> on{" "}
				<strong>{comment._createdAt?.split("T")[0]}</strong>
			</span>
			<p className="comment-content">{comment.comment.trim()}</p>
			<button onClick={toggleReplyBox} className="reply-button">
				Reply
			</button>
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
