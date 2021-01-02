import { useState } from "react";
import Emoji from "./Emoji";

export default function EmojiWithCounter({
	emoji,
	emojiLabel,
	initialCounter,
	onIncrease,
}) {
	// const addReaction = () => {
	// 	if (canAddReaction) {
	// 		setCanAddReaction(false);
	// 		setCounter(counter + 1);
	// 		// fetch("/api/addReaction", {
	// 		// 	method: "POST",
	// 		// 	body: JSON.stringify({
	// 		// 		emojiLabel: emojiLabel,
	// 		// 		amount: counter,
	// 		// 	}),
	// 		// });
	// 		setTimeout(() => {
	// 			setCanAddReaction(true);
	// 		}, 500);
	// 	}
	// };

	// const [canAddReaction, setCanAddReaction] = useState(true);

	// const [counter, setCounter] = useState(initialCounter);

	return (
		<span
			className="emoji-container"
			id={emojiLabel}
			onClick={() => onIncrease(emoji)}
		>
			<Emoji emoji={emoji} label={emojiLabel} />
			<div className="emoji-counter-div">
				<span className="emoji-counter ">{initialCounter}</span>
			</div>
		</span>
	);
}
