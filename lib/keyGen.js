export default function getKey() {
	return (Math.random() * (9 - 0) + 0)
		.toString()
		.replace(".", "")
		.substring(0, 20);
}
