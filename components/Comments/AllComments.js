import { useState, useEffect, createContext } from "react";
import dynamic from "next/dynamic";
import { client } from "../../lib/sanityClient";
import load from "@pandasekh/dynamic-script-loader";

const ReactionsContext = createContext(undefined);

export default function AllComments() {
	const [comments, setComments] = useState();
	const [reactions, setReactions] = useState();
	const [isLoading, setIsLoading] = useState(true);

	const Comment = dynamic(() => import("./SingleComment"));
	const LoadingComponent = dynamic(() => import("../LoadingComponent"));

	const query = `*[_type == "comment" && approved==true]{_id, comment, name, _createdAt, childComments} | order (_createdAt)`;
	let querySub = undefined;

	useEffect(async () => {
		// Set the already existing comments
		setComments(await client.fetch(query).then(r => r));
		// Subscribe to the query Observable and update the state on each update
		querySub = client.listen(query).subscribe(update => {
			if (update) {
				setComments(comments =>
					[
						...comments.filter(
							comment => comment._id !== update.result._id
						),
						update.result,
					].sort((a, b) => (a._createdAt > b._createdAt ? 1 : -1))
				);
			}
		});

		client
			.fetch(`*[_type == "commentReactions"]`)
			.then(r => setReactions(r));

		// Dynamically import Google ReCaptcha
		load(
			`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`
		).then(() => setIsLoading(false));
		// Unsubscribe on Component unmount
		return () => {
			querySub.unsubscribe();
		};
	}, []);

	const commentList = comments?.map(comment => {
		return <Comment key={comment._id} comment={comment} />;
	});

	return (
		<ReactionsContext.Provider value={reactions}>
			{isLoading ? <LoadingComponent /> : <ul>{commentList}</ul>}
		</ReactionsContext.Provider>
	);
}

export { ReactionsContext };
