import Header from '../Header';
import { ReactNode } from 'react';
import Stats from '@components/Stats';

interface LayoutProps {
	children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
	return (
		<div className="flex flex-col items-center">
			<Header />
			<Stats />
			{children}
		</div>
	);
}
