const hashString = input => {
	let hash = 0,
		i,
		chr;
	for (i = 0; i < input.length; i++) {
		chr = input.charCodeAt(i);
		hash = (hash << 5) - hash + chr;
		hash |= 0;
	}
	return hash;
};

export default hashString;
