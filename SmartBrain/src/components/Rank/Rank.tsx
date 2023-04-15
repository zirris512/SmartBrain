import { User } from "../../globalTypes/globalTypes";

const Rank = ({ name, rank }: { name: string | undefined; rank: number | undefined }) => {
	return (
		<div>
			<div className="white f3">{name ? name : "John Doe"}, your current entry count is...</div>
			<div className="white f1">{rank ? rank : 0}</div>
		</div>
	);
};
export default Rank;
