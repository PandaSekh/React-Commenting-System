import hashString from "./stringHash";

const loadScript = (scriptSrc, callback) => {
	const hashedId = hashString(scriptSrc);

	const checkScript = document.getElementById(hashedId);

	if (!checkScript) {
		const script = document.createElement("script");
		script.src = scriptSrc;
		script.id = hashedId;
		document.body.appendChild(script);

		if (callback) {
			script.onload = () => callback();
		}
	}
	if (checkScript && callback) {
		callback();
	}
};

export default loadScript;
