import { client } from "../../lib/sanityClient";
import imageUrlBuilder from "@sanity/image-url";

export default function CommentImage({ commentImage }) {
	const imgUrl = commentImage
		? imageUrlBuilder(client).image(commentImage)
		: "https://hope.be/wp-content/uploads/2015/05/no-user-image.gif";

	return (
		<div className="commentImage">
			<img src={imgUrl}></img>
		</div>
	);
}
