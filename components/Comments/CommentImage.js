import { client } from "../../lib/sanityClient";
import imageUrlBuilder from "@sanity/image-url";
import { AvatarGenerator } from "random-avatar-generator";

export default function CommentImage({ commentImage, username }) {
	// let imgUrl =
	// 	username === "Anonymous"
	// 		? "https://icon-library.com/images/generic-user-icon/generic-user-icon-19.jpg"
	// 		: commentImage
	// 		? imageUrlBuilder(client).image(commentImage)
	// 		: new AvatarGenerator().generateRandomAvatar(username);

	let alternativeImgUrl = commentImage
		? imageUrlBuilder(client).image(commentImage)
		: `https://identicon-api.herokuapp.com/${username}>/${50}>?format=png`;

	return (
		<div className="commentImage">
			<img
				// src={imgUrl}
				src={alternativeImgUrl}
			></img>
		</div>
	);
}
