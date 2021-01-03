export default function Emoji({ emoji, label, className, onClickCallback }) {
	return (
		<span
			className={
				className ? className + " emoji hvr-grow " : "emoji hvr-grow "
			}
			role="img"
			aria-label={label ? label : ""}
			aria-hidden={label ? "false" : "true"}
			onClick={onClickCallback}
		>
			{emoji}
		</span>
	);
}
