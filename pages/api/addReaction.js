require("dotenv").config();
import { writeClient } from "../../lib/sanityClient";

export default (req, res) => {
	console.log("Called method");
	return new Promise(resolve => {
		// Prepare the document
		const body = JSON.parse(req.body);
		const _id = body.commentId;
		const reactions = body.reactions;
		reactions.forEach(r => (r._key = r.label));

		const query = `*[_type == "commentReactions" && commentId == "${_id}"]{_id}[0]`;
		// const comment = await writeClient.fetch(query);
		writeClient.fetch(query).then(comment => {
			console.log("before if, comment: ", comment);
			if (comment) {
				writeClient
					.patch(comment._id)
					.set({ reactions: reactions })
					.commit()
					.then(() => {
						console.log("then ");
						resolve(res.status(200).end());
					});
			} else {
				writeClient
					.create({
						_type: "commentReactions",
						commentId: _id,
						reactions: reactions,
					})
					.then(() => {
						console.log("then in");
						resolve(res.status(200).end());
					});
			}
		});
	});
};
