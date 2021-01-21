import { useState, useEffect, useContext } from "react";
import { ReactionsContext } from "../Comments/AllComments";
import { client } from "../../lib/sanityClient";
import { DEFAULT_EMOJI_OPTIONS } from "../../lib/emojiConfig";

import Reactions from "lepre";

let dbDebouncerTimer;
// eslint-disable-next-line react/prop-types
export default function ReactionBlock({ commentId }) {
	// We get the initial reactions we previously fetched from the Context
	const contextReactions = useContext(ReactionsContext)
		?.filter(r => r.commentId === commentId)
		.map(r => r.reactions)
		?.sort((a, b) => (a.counter < b.counter ? 1 : -1))[0];
	const [reactions, setReactions] = useState([]);

	useEffect(() => {
		// If there are reactions in the context, set them
		if (contextReactions) setReactions(contextReactions);
		let querySub = undefined;
		// // Subscribe to the query Observable and update the state on each update
		const query = `*[_type == "commentReactions" && commentId=="${commentId}"]`;
		querySub = client.listen(query).subscribe(update => {
			if (update) {
				setReactions([
					...update.result.reactions.sort((a, b) =>
						a.emoji < b.emoji ? 1 : -1
					),
				]);
			}
		});
		// Unsubscribe on Component unmount
		return () => {
			querySub.unsubscribe();
		};
	}, [contextReactions, commentId]);

	const onUpdate = newState => {
		setReactions(...newState);
		updateReactionsOnDatabase();
	};

	// Debouncer to avoid updating the database on every click
	function updateReactionsOnDatabase() {
		clearTimeout(dbDebouncerTimer);
		dbDebouncerTimer = setTimeout(() => {
			fetch("/api/addReaction", {
				method: "POST",
				body: JSON.stringify({
					commentId: commentId,
					reactions: reactions,
				}),
			});
			dbDebouncerTimer = null;
		}, 1000 * 1);
	}

	return (
		<Reactions
			emojis={DEFAULT_EMOJI_OPTIONS}
			selected={reactions}
			onUpdate={onUpdate}
		/>
	);
}
