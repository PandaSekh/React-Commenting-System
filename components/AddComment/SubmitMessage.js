export default function SubmitMessage({ message }) {
	return (
		<div
			id="submitMessage"
			className={message.success ? "success" : "error"}
		>
			{message.text}
		</div>
	);
}
