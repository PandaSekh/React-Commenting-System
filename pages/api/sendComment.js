require("dotenv").config();
import getKey from "../../lib/keyGen";
import sanitizeHtml from "sanitize-html";
import { writeClient } from "../../lib/sanityClient";

export default (req, res) => {
	return new Promise(async (resolve, reject) => {
		const doc = JSON.parse(req.body);
		// Check ReCaptcha Token
		const isValidToken = await verifyRecaptchaToken(doc.token);
		if (!isValidToken) {
			res.status(406).end();
			reject();
		}

		// Update the document with the required values for Sanity
		doc._type = "comment";
		doc._key = getKey();
		doc._id = doc._key;
		doc._createdAt = new Date();
		doc.comment = sanitizeHtml(doc.comment, {
			allowedTags: ["b", "i", "em", "strong", "a", "li", "ul"],
			allowedAttributes: {
				a: ["href"],
			},
		});
		if (!doc.name) doc.name = "Anonymous";
		delete doc.token;

		// If the doc has a parentCommentId, it means it's a child comment
		try {
			if (doc.parentCommentId) {
				// Remove these values from the document, as they're not expected in the database
				const firstParentId = doc.firstParentId;
				const parentCommentId = doc.parentCommentId;
				delete doc.parentCommentId;
				delete doc.firstParentId;

				await appendChildComment(
					firstParentId,
					parentCommentId,
					doc
				).then(() => {
					res.status(200).json({ message: "Comment Created" });
					resolve();
				});
			} else {
				// If there's no parentCommentId, just create a new comment
				writeClient.create(doc).then(() => {
					res.status(200).json({ message: "Comment Created" });
					resolve();
				});
			}
		} catch (err) {
			res.status(500).json({ message: String(err) });
			reject();
		}
	});
};

function verifyRecaptchaToken(token) {
	return fetch("https://www.google.com/recaptcha/api/siteverify", {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: `secret=${process.env.RECAPTCHA_SECRET}&response=${token}`,
	})
		.then(r => r.json())
		.then(j => {
			return j.success;
		});
}

async function appendChildComment(
	firstParentId,
	parentCommentId,
	childComment
) {
	// Get the first level parent
	const query = `*[_type == "comment" && _id == "${firstParentId}"][0]`;
	const parentComment = await writeClient.fetch(query).then(r => r);

	// Parent Comment has no children, just create a new Array with the child comment
	if (!parentComment.childComments) {
		parentComment.childComments = [childComment];
	} else if (parentComment._id === parentCommentId) {
		// Parent Comment is a first level comment, so just append the comment
		parentComment.childComments = [
			...parentComment.childComments,
			childComment,
		];
	} else {
		// Parent comment is a level two or more nested comment
		// We need to find the actual parent comment in all nested comments
		const childToUpdate = getChildComment(parentComment, parentCommentId);

		if (!childToUpdate.childComments) {
			// Parent comment has no children, create new Array with the new child
			childToUpdate.childComments = [childComment];
		} else {
			// Parent comment already has some children
			// Add the new childComment, filtering the previous Array to remove the
			childToUpdate.childComments = [
				...childToUpdate.childComments.filter(
					c => c._id !== childComment._id
				),
				childComment,
			];
		}
	}
	// Patch the document
	writeClient
		.patch(parentComment._id)
		.set(parentComment)
		.commit()
		.then(() => {
			return childComment._key;
		});

	// Return the key or the id so we can focus the comment
}

// Recursive function which search every child for other children and returns the child to be modified
function getChildComment(firstParentComment, childCommentId) {
	let returnComment = null;
	firstParentComment?.childComments?.forEach(c => {
		if (c._id == childCommentId) {
			returnComment = c;
		} else if (c.childComments) {
			returnComment = getChildComment(c, childCommentId);
		} else {
			return returnComment;
		}
	});
	return returnComment;
}
