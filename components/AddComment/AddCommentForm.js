import { useForm } from "react-hook-form";
import InputError from "./InputError";
import { Fragment, useState } from "react";
import SubmitMessage from "./SubmitMessage";
import ImageUpload from "./ImageUpload";

export default function AddCommentForm({
	parentCommentId,
	firstParentId,
	extraClass,
}) {
	const [submitMessage, setSubmitMessage] = useState({});
	const [submittedFormData, setSubmittedFormData] = useState({});
	const [isSending, setIsSending] = useState(false);
	const { register, errors, handleSubmit, reset } = useForm();

	const [imgSrc, setImgSrc] = useState("");

	function uploadHandler(e) {
		setImgSrc(URL.createObjectURL(e.target.files[0]));
	}

	const onSubmit = data => {
		setSubmittedFormData(data);
		setIsSending(true);

		if (data.userImage) data.userImage = data.userImage[0];

		if (parentCommentId) {
			data.parentCommentId = parentCommentId;
			data.firstParentId = firstParentId;
		}

		grecaptcha.ready(() => {
			grecaptcha
				.execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY, {
					action: "submit",
				})
				.then(token => {
					data.token = token;
					fetch("/api/sendComment", {
						method: "POST",
						body: JSON.stringify(data),
					})
						.then(r => {
							if (r.status !== 200) {
								r.json().then(e => {
									throw new Error(e);
								});
							} else return r.json();
						})
						.then(j => {
							reset({ ...submittedFormData });
							setSubmittedFormData({});
							setIsSending(false);

							setSubmitMessage({
								text: j.message,
								success: true,
							});
							setTimeout(() => {
								setSubmitMessage({});
							}, 2000);
						})
						.catch(err => {
							setSubmitMessage({
								text: String(err.message),
								success: false,
							});
							setTimeout(() => {
								setSubmitMessage({});
							}, 2000);
						});
				});
		});
	};

	return (
		<Fragment>
			{submitMessage !== undefined && (
				<SubmitMessage message={submitMessage} />
			)}
			<form onSubmit={handleSubmit(onSubmit)} className={extraClass}>
				<ImageUpload
					uploadHandler={uploadHandler}
					imgSrc={imgSrc}
					register={register}
				/>
				<input
					type="text"
					placeholder="Name (Optional)"
					name="name"
					ref={register({ required: false, maxLength: 80 })}
				/>
				{errors.name && <InputError error={"Your name is required"} />}
				<input
					type="text"
					placeholder="Email (Optional)"
					name="email"
					ref={register({ required: false, pattern: /^\S+@\S+$/i })}
				/>
				{errors.email && <InputError error={"Invalid email"} />}
				<textarea
					name="comment"
					placeholder="Your Comment (Supports Markdown)"
					rows="5"
					ref={register({ required: true, maxLength: 5000 })}
				/>
				{errors.comment && (
					<InputError error={"You need to write something"} />
				)}
				<input
					type="submit"
					disabled={isSending}
					value={isSending ? "Sending Comment..." : "Send Comment"}
				/>
			</form>
		</Fragment>
	);
}
