import { motion } from 'framer-motion';
import QRCode from 'react-qr-code';

interface QRCodeProps {
	text: string;
}

export default function _QRCode({ text }: QRCodeProps) {
	return (
		<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 0.5 }}>
			<h2 className="my-4 text-center text-xl">{text}</h2>
			<QRCode value="https://memory.valchy.com" />
		</motion.div>
	);
}
