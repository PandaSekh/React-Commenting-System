const formatDate = fullDate => {
	const date = fullDate?.split("T")[0];
	const year = date.split("-")[0];
	const month = new Date(date).toLocaleDateString("default", {
		month: "long",
	});
	const day = date.split("-")[2];

	return `${day} ${month} ${year}`;
};

export { formatDate };
