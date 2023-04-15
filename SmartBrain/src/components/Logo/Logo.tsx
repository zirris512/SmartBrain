import Tilt from "react-parallax-tilt";
import brain from "../../assets/brain-100.png";
import "./Logo.css";

const Logo = () => {
    return (
        <div className="ma4 mt0">
            <Tilt
                className="br2 shadow-2 Tilt"
                style={{ height: "150px", width: "150px", backgroundColor: "darkgreen" }}
                tiltMaxAngleX={30}
                tiltMaxAngleY={30}
            >
                <div className="h-100 flex items-center justify-center">
                    <img src={brain} alt="logo" />
                </div>
            </Tilt>
        </div>
    );
};

export default Logo;
