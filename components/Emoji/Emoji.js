export default function Emoji({ emoji, label }) {
	return (
		<span
			className="emoji"
			role="img"
			aria-label={label ? label : ""}
			aria-hidden={label ? "false" : "true"}
		>
			{emoji}
		</span>
	);
}
