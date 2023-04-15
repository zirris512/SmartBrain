import { useRef, useState } from "react";
import ParticlesBg from "particles-bg";

import { ImageBoxType, User } from "./globalTypes/globalTypes";
import Nav from "./components/Nav/Nav";
import Signin from "./components/Signin/Signin";
import Register from "./components/Register/Register";
import Logo from "./components/Logo/Logo";
import Rank from "./components/Rank/Rank";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import "./App.css";

const MODEL_ID = "face-detection";

interface BoxType {
	bounding_box: {
		bottom_row: number;
		left_col: number;
		right_col: number;
		top_row: number;
	};
}

interface ClarifaiDataType {
	outputs: {
		data: {
			regions: {
				region_info: BoxType;
			}[];
		};
	}[];
}

function App() {
	const [input, setInput] = useState("");
	const [imageUrl, setImageUrl] = useState("");
	const [box, setBox] = useState<ImageBoxType | null>(null);
	const [route, setRoute] = useState("signin");
	const [isSignedIn, setIsSignedIn] = useState(false);
	const [user, setUser] = useState<User>({} as User);

	const imageRef = useRef<HTMLImageElement>(null);

	function loadUser(user: User) {
		setUser(user);
	}

	function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
		setInput(e.target.value);
	}

	function onButtonSubmit(e: React.MouseEvent<HTMLButtonElement>) {
		setImageUrl(input);
		// const requestOptions = setupClarifai(input);

		// fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/outputs", requestOptions)
		// 	.then((response) => {
		// 		fetch("/api/image", {
		// 			method: "PUT",
		// 			headers: {
		// 				"Content-Type": "application/json",
		// 			},
		// 			body: JSON.stringify({
		// 				id: user?.id,
		// 			}),
		// 		})
		// 			.then((response) => response.json())
		// 			.then((count: number) => {
		// 				setUser((prev) => ({ ...prev, entries: count }));
		// 			});
		// 		return response.json();
		// 	})
		// 	.then((result: ClarifaiDataType) => {
		// 		const imageRegion = result.outputs[0].data.regions?.[0];
		// 		if (!imageRegion) {
		// 			return;
		// 		}
		// 		displayFaceBox(calculateFaceLocation(imageRegion.region_info));
		// 	})
		// 	.catch((error) => console.log("error", error));
		fetch("/api/clarifai", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				url: input,
			}),
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error(`status ${response.status}: ${response.statusText}`);
				}
				return response.json();
			})
			.then((data: BoxType) => {
				displayFaceBox(calculateFaceLocation(data));
				incrementEntryCount();
			})
			.catch((error) => {
				console.log(error);
			});
	}

	function incrementEntryCount() {
		fetch("/api/image", {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				id: user?.id,
			}),
		})
			.then((response) => response.json())
			.then((count: number) => {
				setUser((prev) => ({ ...prev, entries: count }));
			});
	}

	function calculateFaceLocation(data: BoxType): ImageBoxType {
		const clarifaiFace = data.bounding_box;
		const image = imageRef.current!;
		const width = +image.width;
		const height = +image.height;
		return {
			leftCol: clarifaiFace.left_col * width,
			topRow: clarifaiFace.top_row * height,
			rightCol: width - clarifaiFace.right_col * width,
			bottomRow: height - clarifaiFace.bottom_row * height,
		};
	}

	function displayFaceBox(box: ImageBoxType) {
		setBox(box);
	}

	function onRouteChange(route: string) {
		// e.preventDefault();

		if (route !== "home") {
			setIsSignedIn(false);
		} else {
			setIsSignedIn(true);
		}

		setRoute(route);
	}

	return (
		<div className="App">
			<ParticlesBg type="cobweb" bg={true}></ParticlesBg>
			<Nav onRouteChange={onRouteChange} isSignedIn={isSignedIn} />
			{route === "home" ? (
				<>
					<Logo />
					<Rank name={user?.name} rank={user?.entries} />
					<ImageLinkForm onInputChange={onInputChange} onButtonSubmit={onButtonSubmit} />
					<FaceRecognition imageUrl={imageUrl} imageRef={imageRef} box={box} />
				</>
			) : route === "signin" ? (
				<Signin onRouteChange={onRouteChange} loadUser={loadUser} />
			) : (
				<Register onRouteChange={onRouteChange} loadUser={loadUser} />
			)}
		</div>
	);
}

// function setupClarifai(imageURL: string) {
// 	const PAT = "ca3ef278f64446cc99bd34a3deb53aa0";
// 	const USER_ID = "luhuli";
// 	const APP_ID = "SmartBrainApp";

// 	const raw = JSON.stringify({
// 		user_app_id: {
// 			user_id: USER_ID,
// 			app_id: APP_ID,
// 		},
// 		inputs: [
// 			{
// 				data: {
// 					image: {
// 						url: imageURL,
// 					},
// 				},
// 			},
// 		],
// 	});

// 	return {
// 		method: "POST",
// 		headers: {
// 			Accept: "application/json",
// 			Authorization: "Key " + PAT,
// 		},
// 		body: raw,
// 	};
// }
export default App;
