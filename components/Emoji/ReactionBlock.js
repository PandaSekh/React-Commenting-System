import EmojiWithCounter from "./EmojiWithCounter";
import getKey from "../../lib/keyGen";
import EmojiAdder from "./EmojiAdder";
import { useState, useEffect } from "react";

let dbDebouncerTimer;
export default function ReactionBlock({ reactions, commentId, firstParentId }) {
	const [reactionsState, setReactionsState] = useState([]);
	const [shouldUpdateDb, setShouldUpdateDb] = useState(false);

	const EMOJI_OPTIONS = [
		{
			emoji: "😄",
			label: "happy",
			_key: "happy",
		},
		{
			emoji: "📚",
			label: "books",
			_key: "books",
		},
		{
			emoji: "😟",
			label: "suprised",
			_key: "suprised",
		},
	];

	useEffect(async () => {
		if (reactions) {
			setReactionsState(
				reactions.sort((a, b) => (a.counter < b.counter ? 1 : -1))
			);
		}
	}, []);

	useEffect(() => {
		if (shouldUpdateDb) updateReactionsOnDatabase();
	}, [shouldUpdateDb]);

	const updateEmojiCount = emoji => {
		setShouldUpdateDb(false);
		let emojiFromState = reactionsState.filter(em => em.emoji === emoji)[0];
		if (!emojiFromState) {
			console.log("Emoji was not in state");
			emojiFromState = EMOJI_OPTIONS.filter(em => em.emoji === emoji)[0];
			emojiFromState.counter = 1;
			setReactionsState(reactionsState =>
				[...reactionsState, emojiFromState].sort((a, b) =>
					a.counter < b.counter ? 1 : -1
				)
			);
		} else {
			emojiFromState.counter++;
			setReactionsState(reactions =>
				[
					...reactions.filter(
						rea => rea.emoji !== emojiFromState.emoji
					),
					emojiFromState,
				].sort((a, b) => (a.counter < b.counter ? 1 : -1))
			);
		}
		setShouldUpdateDb(true);
	};

	// We won't update the database on every click
	function updateReactionsOnDatabase() {
		clearTimeout(dbDebouncerTimer);
		dbDebouncerTimer = setTimeout(() => {
			fetch("/api/addReaction", {
				method: "POST",
				body: JSON.stringify({
					commentId: commentId,
					reactions: reactionsState,
					firstParentId: firstParentId,
				}),
			});
		}, 1000 * 2);
	}

	const mappedReactions = reactionsState.map(reaction => (
		<EmojiWithCounter
			key={getKey()}
			emoji={reaction.emoji}
			emojiLabel="happy"
			initialCounter={reaction.counter}
			onIncrease={updateEmojiCount}
		/>
	));

	return (
		<div className="reaction-block">
			{mappedReactions}
			<EmojiAdder
				selectedEmojis={reactionsState}
				updateEmojiCount={updateEmojiCount}
				EMOJI_OPTIONS={EMOJI_OPTIONS}
			/>
		</div>
	);
}
