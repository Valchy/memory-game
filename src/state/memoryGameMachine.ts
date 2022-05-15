import { createMachine, assign } from 'xstate';

type Tile = {
	guessed: boolean;
	index: number;
};

interface Context {
	game_time: number;
	guesses: number;
	tiles: Tile[];
	tiles_left: number;
	chosen_tile: number | null;
	compare_tile: number | null;
}

const memoryGameMachine = createMachine<Context>(
	{
		id: 'memory_game',
		initial: 'idle',
		context: {
			game_time: 0,
			guesses: 0,
			tiles: [],
			tiles_left: 0,
			chosen_tile: null,
			compare_tile: null,
		},
		states: {
			idle: {
				on: {
					START_GAME: {
						actions: 'LOAD_GAME',
						target: 'playing',
					},
				},
			},
			playing: {
				invoke: {
					id: 'game_time',
					src: (context, event) => (callback, onReseive) => {
						const inc = setInterval(() => callback('INC_GAME_TIME'), 1000);
						return () => clearInterval(inc);
					},
				},
				on: {
					GUESS: [
						{
							cond: (context) => context.chosen_tile === context.compare_tile && context.tiles_left === 2,
							actions: ['DO_GUESS', 'CORRECT_GUES'],
							target: 'game_over',
						},
						{
							cond: (context) => context.chosen_tile === context.compare_tile,
							actions: ['DO_GUESS', 'CORRECT_GUESS'],
						},
						{
							actions: 'DO_GUESS',
						},
					],
					INC_GAME_TIME: {
						actions: assign({
							game_time: (context) => context.game_time + 1,
						}),
					},
				},
			},
			game_over: {
				on: {
					PLAY_AGAIN: {
						actions: ['RESET_GAME', 'LOAD_GAME'],
						target: 'playing',
					},
				},
			},
		},
	},
	{
		actions: {
			RESET_GAME: assign({
				game_time: (context) => 0,
				guesses: (context) => 0,
				tiles: (context) => [],
				tiles_left: (context) => 0,
			}),
			DO_GUESS: assign({
				chosen_tile: (context) => null,
				compare_tile: (context) => null,
				guesses: (context) => context.guesses + 1,
			}),
			CORRECT_GUESS: assign({
				tiles_left: (context) => context.tiles_left - 2,
			}),
			LOAD_GAME: assign({
				tiles: (context, event) => event.tiles,
			}),
		},
	}
);

export default memoryGameMachine;
