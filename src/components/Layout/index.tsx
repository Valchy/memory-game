import Header from '../Header';
import { ReactNode } from 'react';
import { AnimatePresence } from 'framer-motion';

interface LayoutProps {
	children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
	return (
		<div className="flex flex-col items-center">
			<Header />
			{/* <AnimatePresence exitBeforeEnter>{children}</AnimatePresence> */}
			{children}
		</div>
	);
}
