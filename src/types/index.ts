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

export interface Context {
	game_time: number;
	guesses: number;
	tiles: TileType[];
	pairs_left: number;
	chosen_tile: number | null;
	compare_tile: number | null;
}

export type CorrectGuessType = {
	cond: {
		checkForMatch: boolean;
		checkForLastPair: boolean;
	};
};
