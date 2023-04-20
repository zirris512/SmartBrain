import type { ImageBoxType } from "../../globalTypes/globalTypes";
import "./FaceRecognition.css";

interface FaceRecognitionPropType {
	imageUrl: string;
	imageRef: React.RefObject<HTMLImageElement>;
	boxes: ImageBoxType[] | null;
}

const FaceRecognition = ({ imageUrl, imageRef, boxes }: FaceRecognitionPropType) => {
	const boxStyles = boxes?.map((box) => ({
		top: box?.topRow,
		right: box?.rightCol,
		bottom: box?.bottomRow,
		left: box?.leftCol,
	}));

	return (
		<div className="center ma">
			<div className="mt2 relative dib">
				{imageUrl !== "" && <img src={imageUrl} alt="image" width="500px" ref={imageRef} />}
				{boxStyles?.map((boxStyle, idx) => (
					<div className="bounding-box" key={idx} style={boxStyle}></div>
				))}
			</div>
		</div>
	);
};
export default FaceRecognition;
