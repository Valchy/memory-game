import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
	return (
		<Html lang="en">
			<Head>
				<meta charSet="utf-8" />
				<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
				<meta name="HandheldFriendly" content="True" />
				<title>Memory Game</title>
				<link rel="icon" href="icon.png" />
				<link rel="apple-touch-icon" href="icon.png" />

				<meta
					name="description"
					content="Fun memory game with three different difficulty levels"
				/>
				<meta name="author" content="Valeri Sabev" />
				<meta property="og:title" content="Valchy memory" />
				<meta name="twitter:title" content="Valchy memory" />
				<meta
					property="og:image"
					content="https://memory.valchy.com/icon.png"
				/>
				<meta property="og:image:alt" content="memory Logo" />
				<meta
					name="twitter:image"
					content="https://memory.valchy.com/icon.png"
				/>
				<meta
					property="og:description"
					content="Fun memory game with three different difficulty levels"
				/>
				<meta name="twitter:card" content="summary_large_image" />
				<meta
					name="twitter:description"
					content="Fun memory game with three different difficulty levels"
				/>
			</Head>
			<body className="bg-[#121212] text-white">
				<noscript>You need to enable JavaScript to run this app.</noscript>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
