import type { ImageBoxType } from "../../globalTypes/globalTypes";
import "./FaceRecognition.css";

interface FaceRecognitionPropType {
    imageUrl: string;
    imageRef: React.RefObject<HTMLImageElement>;
    box: ImageBoxType | null;
}

const FaceRecognition = ({ imageUrl, imageRef, box }: FaceRecognitionPropType) => {
    const boxStyles = {
        top: box?.topRow,
        right: box?.rightCol,
        bottom: box?.bottomRow,
        left: box?.leftCol,
    };

    return (
        <div className="center ma">
            <div className="mt2 relative dib">
                <img src={imageUrl} alt="image" width="500px" ref={imageRef} />
                <div className="bounding-box" style={boxStyles}></div>
            </div>
        </div>
    );
};
export default FaceRecognition;
