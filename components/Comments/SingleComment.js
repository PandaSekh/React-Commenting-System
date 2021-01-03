import AddComment from "../AddComment/AddCommentForm";
import { useState } from "react";
import CommentImage from "./CommentImage";
import ReactionBlock from "../Emoji/ReactionBlock";
import parser from "../../lib/snarkdown";
import { formatDate } from "../../lib/utils";

export default function Comment({ comment, firstParentId }) {
	const [showReplyBox, setShowReplyBox] = useState(false);
	const toggleReplyBox = () => setShowReplyBox(!showReplyBox);

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
			<p
				className="comment-content"
				dangerouslySetInnerHTML={{
					__html: parser(comment.comment.trim()),
				}}
			></p>
			<div className="reaction-div">
				<button onClick={toggleReplyBox} className="reply-button">
					Reply
				</button>
				<ReactionBlock commentId={comment._id} />
			</div>
			{showReplyBox && (
				<AddComment
					parentCommentId={comment._id}
					firstParentId={firstParentId || comment._id}
				/>
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
