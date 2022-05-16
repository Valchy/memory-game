import { motion } from 'framer-motion';
import Link from 'next/link';
import { MouseEvent } from 'react';

type Button = {
	href: string;
	text: string;
	event?: () => void;
};

interface ButtonsProps {
	arr: Button[];
}

export default function Buttons({ arr }: ButtonsProps) {
	const handleNoLink = (e: MouseEvent<HTMLElement>, href: string, event: () => void) => {
		if (href === '#') e.preventDefault();
		event();
	};

	return (
		<motion.div transition={{ when: 'beforeChildren' }} className="flex cursor-pointer flex-col md:flex-row">
			{arr.map(({ href, text, event = () => {} }, index) => (
				<Link href={href} key={href}>
					<motion.div
						initial={{ x: -20, opacity: 0 }}
						animate={{ x: 0, opacity: 1 }}
						whileTap={{ scale: 0.95 }}
						exit={{ scale: 1 }}
						transition={{ delay: index * 0.1 + 0.2 }}
						className="m-2 rounded bg-[#181818] p-6 hover:scale-[1.05]"
					>
						<a onClick={(e) => handleNoLink(e, href, event)} className="m-2 rounded bg-[#181818] p-6 hover:scale-[1.05]">
							{text}
						</a>
					</motion.div>
				</Link>
			))}
		</motion.div>
	);
}
