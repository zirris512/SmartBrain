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

interface BoxType {
	bottom_row: number;
	left_col: number;
	right_col: number;
	top_row: number;
}

function App() {
	const [input, setInput] = useState("");
	const [imageUrl, setImageUrl] = useState("");
	const [boxes, setBoxes] = useState<ImageBoxType[] | null>(null);
	const [route, setRoute] = useState("signin");
	const [isSignedIn, setIsSignedIn] = useState(false);
	const [user, setUser] = useState<User>({} as User);

	const imageRef = useRef<HTMLImageElement>(null);

	function loadUser(user: User) {
		setImageUrl("");
		setBoxes(null);
		setUser(user);
	}

	function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
		setInput(e.target.value);
	}

	function onButtonSubmit(e: React.MouseEvent<HTMLButtonElement>) {
		setImageUrl(input);
		setBoxes(null);
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
			.then((data: BoxType[]) => {
				const transformedBox = data.map((box) => calculateFaceLocation(box));
				setBoxes(transformedBox);
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
			})
			.catch((error) => {
				console.log(error);
			});
	}

	function calculateFaceLocation(data: BoxType): ImageBoxType {
		const clarifaiFace = data;
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

	function onRouteChange(route: string) {
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
					<FaceRecognition imageUrl={imageUrl} imageRef={imageRef} boxes={boxes} />
				</>
			) : route === "signin" ? (
				<Signin onRouteChange={onRouteChange} loadUser={loadUser} />
			) : (
				<Register onRouteChange={onRouteChange} loadUser={loadUser} />
			)}
		</div>
	);
}

export default App;
