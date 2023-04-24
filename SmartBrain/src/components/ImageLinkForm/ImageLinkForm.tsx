import "./ImageLinkForm.css";

interface ImageLinkFormPropType {
	onInputChange: React.ChangeEventHandler<HTMLInputElement>;
	onButtonSubmit: React.MouseEventHandler<HTMLButtonElement>;
}

const ImageLinkForm = ({ onInputChange, onButtonSubmit }: ImageLinkFormPropType) => {
	return (
		<div>
			<p className="f3">This Magic Brain will detect faces in your pictures. Give it a try.</p>
			<div className="flex justify-center">
				<div className="form flex justify-center pa4 br3 shadow-5">
					<input
						type="text"
						className="f4 pa2 w-70 center"
						onChange={onInputChange}
						placeholder="Enter an image url..."
					/>
					<button
						className="w-30 grow f4 link ph3 pv2 dib white bg-light-purple"
						onClick={onButtonSubmit}
					>
						Detect
					</button>
				</div>
			</div>
		</div>
	);
};
export default ImageLinkForm;
