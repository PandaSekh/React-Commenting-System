require("dotenv").config();
const sanityClient = require("@sanity/client");
import getKey from "../../lib/keyGen";

const client = sanityClient({
	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
	dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
	token: process.env.SANITY_W_TOKEN,
	useCdn: false,
});

export default async (req, res) => {
	const reaction = JSON.parse(req.body);

	client.create(reaction).then(r => console.log(r));
};
