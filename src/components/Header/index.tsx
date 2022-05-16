import Link from 'next/link';

export default function Header() {
	return (
		<header>
			<Link href="/">
				<a className="my-4 block text-3xl">Memory Game</a>
			</Link>
		</header>
	);
}
