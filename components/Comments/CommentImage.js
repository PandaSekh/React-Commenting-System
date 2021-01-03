import { client } from "../../lib/sanityClient";
import imageUrlBuilder from "@sanity/image-url";

export default function CommentImage({ commentImage, username }) {
	let imgUrl = commentImage
		? imageUrlBuilder(client).image(commentImage)
		: `https://identicon-api.herokuapp.com/${username}>/${50}>?format=png`;

	return (
		<div className="commentImage">
			<img src={imgUrl}></img>
		</div>
	);
}
