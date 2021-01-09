require("dotenv").config();
import { writeClient } from "../../lib/sanityClient";

export default (req, res) => {
	return new Promise(resolve => {
		const body = JSON.parse(req.body);
		const userImage = body.userImage;
		const commentKey = body._key;

		client.assets
			.upload("image", createReadStream(filePath), {
				filename: basename(filePath),
			})
			.then(imageAsset => {
				// Here you can decide what to do with the returned asset document.
				// If you want to set a specific asset field you can to the following:
				return client
					.patch("some-document-id")
					.set({
						theImageField: {
							_type: "image",
							asset: {
								_type: "reference",
								_ref: imageAsset._id,
							},
						},
					})
					.commit();
			})
			.then(() => {
				console.log("Done!");
			});
	});
};
