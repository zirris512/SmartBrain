interface FormFieldProps {
	reference: React.Ref<HTMLInputElement>;
	name: string;
	type: string;
	title: string;
	formId: string;
}

const FormField = ({ reference, name, title, type, formId }: FormFieldProps) => {
	return (
		<div className="mt3">
			<label className="db fw6 lh-copy f6" htmlFor={name}>
				{title}
			</label>
			<input
				className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
				type={type}
				name={name}
				id={formId}
				ref={reference}
			/>
		</div>
	);
};
export default FormField;
