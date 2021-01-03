import { Fragment } from "react";
import AddComment from "../components/AddComment/AddCommentForm";
import Comments from "../components/Comments/AllComments";
import Header from "../components/Header";

export default function Home() {
	return (
		<Fragment>
			<Header />
			<div className="container">
				<Comments />
				<AddComment extraClass={"main"} />
			</div>
		</Fragment>
	);
}
