const loadScript = (scriptId, scriptSrc, callback) => {
	const checkScript = document.getElementById(scriptId);

	if (!checkScript) {
		const script = document.createElement("script");
		script.src = scriptSrc;
		script.id = scriptId;
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
