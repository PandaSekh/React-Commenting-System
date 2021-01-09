import getKey from "../../lib/keyGen";

export default function ImageUpload({ imgSrc, uploadHandler, register }) {
	const randomKey = getKey;

	return (
		<label for={`img-upload-randomKey`} class="img-upload-label">
			<div className="icon-upload">
				<div className="camera-icon-container">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						className="camera-icon"
					>
						<path d="M5 5h-3v-1h3v1zm8 5c-1.654 0-3 1.346-3 3s1.346 3 3 3 3-1.346 3-3-1.346-3-3-3zm11-4v15h-24v-15h5.93c.669 0 1.293-.334 1.664-.891l1.406-2.109h8l1.406 2.109c.371.557.995.891 1.664.891h3.93zm-19 4c0-.552-.447-1-1-1-.553 0-1 .448-1 1s.447 1 1 1c.553 0 1-.448 1-1zm13 3c0-2.761-2.239-5-5-5s-5 2.239-5 5 2.239 5 5 5 5-2.239 5-5z" />
					</svg>
				</div>
			</div>
			<div className="new-comment-image">
				<img
					src={
						imgSrc
							? imgSrc
							: `https://identicon-api.herokuapp.com/${randomKey}>/${100}>?format=png`
					}
				/>
			</div>
			<input
				name="userImage"
				type="file"
				id={`img-upload-randomKey`}
				class="img-upload"
				onChange={uploadHandler}
				ref={register({ required: false })}
			/>
		</label>
	);
}
