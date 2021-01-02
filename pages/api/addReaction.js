require("dotenv").config();
const sanityClient = require("@sanity/client");

const client = sanityClient({
	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
	dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
	token: process.env.SANITY_W_TOKEN,
	useCdn: false,
});

export default async (req, res) => {
	const body = JSON.parse(req.body);

	const _id = body.commentId;
	const reactions = body.reactions;
	const firstParentId = body.firstParentId;

	console.log("Reactions: ", reactions);

	if (!firstParentId) {
		client
			.patch(_id)
			.set({ reactions: reactions })
			.commit()
			.then(r => console.log(r));
	} else {
		// Get the first level parent
		const query = `*[_type == "comment" && _id == "${firstParentId}"][0]`;
		const parentComment = await client.fetch(query).then(r => r);

		const child = getChildComment(parentComment, _id);
		child.reactions = reactions;
		client
			.patch(firstParentId)
			.set(parentComment)
			.commit()
			.then(r => console.log(r));
	}
};

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
