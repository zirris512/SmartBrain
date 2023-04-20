import { useRef } from "react";

import Form from "../Form/Form";
import FormField from "../FormField/FormField";

import { RouteChange, User } from "../../globalTypes/globalTypes";

const Register = ({ onRouteChange, loadUser }: RouteChange) => {
	const emailRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);
	const nameRef = useRef<HTMLInputElement>(null);

	function onSubmitRegister(e: React.FormEvent) {
		e.preventDefault();

		const body = {
			email: emailRef.current?.value,
			password: passwordRef.current?.value,
			name: nameRef.current?.value,
		};

		if (!body.email || body.password || body.name) {
			console.log("Please fill in all required fields");
			return;
		}

		fetch("/api/register", {
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
					title="Register"
					altButtonTitle="Sign In"
					formSubmit={onSubmitRegister}
					navigate={() => onRouteChange("signin")}
				>
					<FormField formId="name" type="text" name="name" title="Name" reference={nameRef} />
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
				{/* <form className="measure center" onSubmit={onSubmitRegister}>
					<fieldset id="sign_up" className="ba b--transparent ph0 mh0">
						<legend className="f1 fw6 ph0 mh0">Register</legend>
						<div className="mt3">
							<label className="db fw6 lh-copy f6" htmlFor="name">
								Name
							</label>
							<input
								className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
								type="text"
								name="name"
								id="name"
								ref={nameRef}
							/>
						</div>
						<div className="mt3">
							<label className="db fw6 lh-copy f6" htmlFor="email-address">
								Email
							</label>
							<input
								className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
								type="email"
								name="email-address"
								id="email-address"
								ref={emailRef}
							/>
						</div>
						<div className="mv3">
							<label className="db fw6 lh-copy f6" htmlFor="password">
								Password
							</label>
							<input
								className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
								type="password"
								name="password"
								id="password"
								ref={passwordRef}
							/>
						</div>
					</fieldset>
					<div>
						<input
							className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
							type="submit"
							value="Register"
						/>
					</div>
					<div className="lh-copy mt3">
						<p onClick={(e) => onRouteChange("signin")} className="f6 link dim black db pointer">
							Sign In
						</p>
					</div>
				</form> */}
			</main>
		</article>
	);
};
export default Register;
