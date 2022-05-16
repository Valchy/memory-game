import { motion } from 'framer-motion';

export default function Stats() {
	return (
		<motion.div className="fixed top-3 left-3 flex flex-col">
			<motion.h2>Game Stats:</motion.h2>
			<motion.span>Total played: 122</motion.span>
		</motion.div>
	);
}
