/* eslint-disable react/prop-types */
import Emoji from "./Emoji";
import { Fragment, useState } from "react";
import getKey from "../../lib/keyGen";

/**
 * Component which renders and handles a basic menu to add emoticons not already added by other users
 */
export default function EmojiAdder({
	selectedEmojis,
	updateEmojiCount,
	EMOJI_OPTIONS,
}) {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

	const alreadySelectedEmojis = selectedEmojis.map(e => e.emoji);

	const emojiOptions = EMOJI_OPTIONS.filter(
		e => !alreadySelectedEmojis.includes(e.emoji)
	).map(singleEmoji => (
		<Emoji
			key={getKey()}
			emoji={singleEmoji.emoji}
			label={singleEmoji.label}
			onClickCallback={() => {
				updateEmojiCount(singleEmoji.emoji);
				toggleMenu();
			}}
		/>
	));

	return (
		<Fragment>
			{emojiOptions.length > 0 && (
				<span className="reaction-adder-emoji">
					<Emoji
						onClickCallback={toggleMenu}
						emoji={"+"}
						label="emoji-adder"
					/>
					<EmojiMenu />
				</span>
			)}
		</Fragment>
	);

	function EmojiMenu() {
		return (
			<div
				className={
					isMenuOpen
						? "emoji-adder-menu-open"
						: "emoji-adder-menu-closed"
				}
			>
				{emojiOptions}
			</div>
		);
	}
}
