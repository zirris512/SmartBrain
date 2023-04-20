interface FormProps {
	formSubmit: React.MouseEventHandler<HTMLFormElement>;
	title: string;
	altButtonTitle: string;
	navigate: React.MouseEventHandler<HTMLParagraphElement>;
	children: React.ReactNode;
}

const Form = ({ formSubmit, title, altButtonTitle, navigate, children }: FormProps) => {
	return (
		<form className="measure center" onSubmit={formSubmit}>
			<fieldset id="sign_up" className="ba b--transparent ph0 mh0">
				<legend className="f1 fw6 ph0 mh0">{title}</legend>
				{children}
			</fieldset>
			<div className="">
				<input
					className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
					type="submit"
					value={title}
				/>
			</div>
			<div className="lh-copy mt3">
				<p onClick={navigate} className="f6 link dim black db pointer">
					{altButtonTitle}
				</p>
			</div>
		</form>
	);
};
export default Form;
