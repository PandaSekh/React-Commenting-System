import { useState, useEffect, Fragment } from "react";
import { client } from "../../lib/sanityClient";
import LoadingComponent from "../LoadingComponent";
const query = `*[_type == "comment"]{_id, comment, name, _createdAt, childComments} | order (_createdAt)`;
import Comment from "./SingleComment";

export default function AllComments() {
	const [comments, setComments] = useState();
	const [isLoading, setIsLoading] = useState(true);

	useEffect(async () => {
		// Set the already existing comments
		setComments(await client.fetch(query).then(r => r));
		// Subscribe to the query Observable and update the state on each update
		const sub = client.listen(query).subscribe(update => {
			if (update) {
				setComments(comments => [
					...comments.filter(
						comment => comment._id !== update.result._id
					),
					update.result,
				]);
			}
		});
		setIsLoading(false);
		// Unsubscribe on Component unmount
		return () => {
			sub.unsubscribe();
		};
	}, []);

	const commentList = comments?.map(comment => {
		return <Comment key={comment._id} comment={comment} />;
	});

	return (
		<Fragment>
			{isLoading ? <LoadingComponent /> : <ul>{commentList}</ul>}
		</Fragment>
	);
}
