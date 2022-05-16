export type FIX_ME_PLS = any;

export type TileType = {
	guessed: boolean;
	active: boolean;
	value: number;
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
	first_selected_tile: number | null;
	second_selected_tile: number | null;
	is_first_pick: boolean;
}
