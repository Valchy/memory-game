import Konami from 'react-konami-code';

export default function Shh() {
	const shh = () => alert('You must be a Jedi to know this...');
	return (
		<div className="mt-4 text-center">
			<Konami action={shh}>Shhhhh....</Konami>
		</div>
	);
}
