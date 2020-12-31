import { useForm } from "react-hook-form";
import InputError from "./InputError";
import { Fragment, useState } from "react";
import SubmitMessage from "./SubmitMessage";

export default function AddCommentForm({ parentCommentId, firstParentId }) {
	const [submitMessage, setSubmitMessage] = useState({});
	const { register, errors, handleSubmit } = useForm();
	const onSubmit = data => {
		console.log("Data: ", data);
		if (parentCommentId) {
			data.parentCommentId = parentCommentId;
			data.firstParentId = firstParentId;
		}
		fetch("/api/sendComment", {
			method: "POST",
			body: JSON.stringify(data),
		})
			.then(r => r.json())
			.then(j => {
				setSubmitMessage({ text: j.message, success: true });
				setTimeout(() => {
					setSubmitMessage({});
				}, 2000);
			})
			.catch(err => {
				setSubmitMessage({ text: err, success: false });
				setTimeout(() => {
					setSubmitMessage({});
				}, 2000);
			});
	};

	return (
		<Fragment>
			{submitMessage && <SubmitMessage message={submitMessage} />}
			<form onSubmit={handleSubmit(onSubmit)}>
				<input
					type="text"
					placeholder="Name"
					name="name"
					ref={register({ required: true, maxLength: 80 })}
				/>
				{errors.name && <InputError error={"Your name is required"} />}
				<input
					type="text"
					placeholder="Email"
					name="email"
					ref={register({ required: true, pattern: /^\S+@\S+$/i })}
				/>
				{errors.email && (
					<InputError error={"Your email is required"} />
				)}
				<textarea
					name="comment"
					placeholder="Your Comment"
					rows="5"
					ref={register({ required: true, maxLength: 5000 })}
				/>
				{errors.comment && (
					<InputError error={"You need to write something"} />
				)}
				<input type="submit" value="Send Comment" />
			</form>
		</Fragment>
	);
}
