interface NavType {
	onRouteChange(route: string): void;
	isSignedIn: boolean;
}

const Nav = ({ onRouteChange, isSignedIn }: NavType) => {
	return (
		<nav style={{ display: "flex", justifyContent: "flex-end" }}>
			{isSignedIn ? (
				<p
					className="f3 link dim black underline pa3 pointer"
					onClick={() => onRouteChange("signin")}
				>
					Sign Out
				</p>
			) : (
				<>
					<p
						className="f3 link dim black underline pa3 pointer"
						onClick={() => onRouteChange("signin")}
					>
						Sign In
					</p>
					<p
						className="f3 link dim black underline pa3 pointer"
						onClick={() => onRouteChange("register")}
					>
						Register
					</p>
				</>
			)}
		</nav>
	);
};

export default Nav;
