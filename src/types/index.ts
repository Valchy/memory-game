export type TileType = {
	guessed: boolean;
	active: boolean;
	number: number;
};

export type GameMode = {
	id: string;
	label: string;
	difficulty: string;
	tiles: number;
};
