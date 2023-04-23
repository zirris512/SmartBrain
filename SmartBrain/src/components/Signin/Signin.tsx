import { useRef } from "react";

import Form from "../Form/Form";
import FormField from "../FormField/FormField";

import { RouteChange, User } from "../../globalTypes/globalTypes";

const Signin = ({ onRouteChange, loadUser }: RouteChange) => {
	const emailRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);

	function onSubmitSignin(e: React.FormEvent) {
		e.preventDefault();

		const body = {
			email: emailRef.current?.value,
			password: passwordRef.current?.value,
		};

		fetch("/api/signin", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(body),
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error(`status ${response.status}: ${response.statusText}`);
				}
				return response.json();
			})
			.then((data: User) => {
				loadUser(data);
				onRouteChange("home");
			})
			.catch((error) => {
				console.log(error);
			});
	}

	return (
		<article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
			<main className="pa4 black-80">
				<Form
					title="Sign In"
					altButtonTitle="Register"
					formSubmit={onSubmitSignin}
					navigate={() => onRouteChange("register")}
				>
					<FormField
						formId="email"
						type="email"
						name="email-address"
						title="Email"
						reference={emailRef}
					/>
					<FormField
						formId="password"
						type="password"
						name="password"
						title="Password"
						reference={passwordRef}
					/>
				</Form>
			</main>
		</article>
	);
};
export default Signin;
