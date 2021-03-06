export default {
	name: "comment",
	title: "Comment",
	type: "document",
	fields: [
		{
			name: "name",
			title: "User Name",
			type: "string",
		},
		{
			name: "email",
			title: "Email",
			type: "string",
		},
		{
			name: "userImage",
			title: "User Image",
			type: "image",
			options: {
				hotspot: true,
			},
		},
		{
			name: "comment",
			title: "Comment",
			type: "text",
		},
		{
			name: "childComments",
			title: "Child Comments",
			type: "array",
			of: [{ type: "comment" }],
		},
		{
			name: "approved",
			title: "Approved",
			type: "boolean",
		},
	],
	preview: {
		select: {
			title: "name",
			subtitle: "comment",
		},
	},
};
