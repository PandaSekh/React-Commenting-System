require("dotenv").config();
import { writeClient } from "../../lib/sanityClient";

export default async (req, res) => {
	// Prepare the document
	const body = JSON.parse(req.body);
	const _id = body.commentId;
	const reactions = body.reactions;
	reactions.forEach(r => (r._key = r.label));

	const query = `*[_type == "commentReactions" && commentId == "${_id}"]{_id}[0]`;
	const documentId = await writeClient.fetch(query).then(r => r._id);

	if (documentId) {
		writeClient.patch(documentId).set({ reactions: reactions }).commit();
	} else {
		writeClient
			.create({
				_type: "commentReactions",
				commentId: _id,
				reactions: reactions,
			})
			.then(r => console.log(r));
	}
	return res.status(200);
};
