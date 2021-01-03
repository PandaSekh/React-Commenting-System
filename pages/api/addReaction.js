require("dotenv").config();
import { writeClient } from "../../lib/sanityClient";

export default (req, res) => {
	return new Promise(async (resolve) => {
		// Prepare the document
		const body = JSON.parse(req.body);
		const _id = body.commentId;
		const reactions = body.reactions;
		reactions.forEach(r => (r._key = r.label));

		const query = `*[_type == "commentReactions" && commentId == "${_id}"]{_id}[0]`;
		const comment = await writeClient.fetch(query);

		if (comment) {
			writeClient
				.patch(comment._id)
				.set({ reactions: reactions })
				.commit();
		} else {
			writeClient.create({
				_type: "commentReactions",
				commentId: _id,
				reactions: reactions,
			});
		}
		res.status(200).end();
		resolve();
	});
};
