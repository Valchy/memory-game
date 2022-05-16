import type { AppProps } from 'next/app';
import { AnimatePresence } from 'framer-motion';
import Head from 'next/head';
import '@styles/globals.css';

export default function MyApp({ Component, pageProps, router }: AppProps) {
	return (
		<>
			<Head>
				<meta charSet="utf-8" />
				<meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
				<meta name="HandheldFriendly" content="True" />
				<title>Memory Game</title>
				<link rel="icon" href="icon.png" />
				<link rel="apple-touch-icon" href="icon.png" />

				<meta name="description" content="Fun memory game with three different difficulty levels" />
				<meta name="author" content="Valeri Sabev" />
				<meta property="og:title" content="Valchy memory" />
				<meta name="twitter:title" content="Valchy memory" />
				<meta property="og:image" content="https://memory.valchy.com/icon.png" />
				<meta property="og:image:alt" content="memory Logo" />
				<meta name="twitter:image" content="https://memory.valchy.com/icon.png" />
				<meta property="og:description" content="Fun memory game with three different difficulty levels" />
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:description" content="Fun memory game with three different difficulty levels" />
			</Head>
			<AnimatePresence exitBeforeEnter>
				<Component key={router.asPath} {...pageProps} />
			</AnimatePresence>
		</>
	);
}
