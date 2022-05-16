import { createMachine, assign } from 'xstate';
import type { TileType } from '@mytypes';

interface Context {
	game_time: number;
	guesses: number;
	tiles: TileType[];
	pairs_left: number;
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
			pairs_left: 0,
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
							cond: (context) => context.chosen_tile === context.compare_tile && context.pairs_left === 2,
							actions: ['DO_GUESS', 'CORRECT_GUES'],
							target: 'game_over',
						},
						{
							cond: (context) => context.chosen_tile === context.compare_tile,
							actions: ['DO_GUESS', 'CORRECT_GUESS'],
						},
						{
							cond: (context) => context.chosen_tile !== null && context.compare_tile !== null,
							actions: 'DO_GUESS',
						},
					],
					TOGGLE_TILE: {
						actions: assign({
							tiles: (context, event) => {
								let shallowCopyContext = [...context.tiles];
								shallowCopyContext[event.index] = {
									...shallowCopyContext[event.index],
									active: !shallowCopyContext[event.index].active,
								};
								return shallowCopyContext;
							},
							chosen_tile: (context, event) => {
								if (context.chosen_tile !== null && context.chosen_tile !== event.index) return event.index;
								else return context.chosen_tile;
							},
							compare_tile: (context, event) => {
								if (context.compare_tile !== null && context.compare_tile !== event.index) return event.index;
								else return context.compare_tile;
							},
						}),
					},
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
				pairs_left: (context) => 0,
			}),
			DO_GUESS: assign({
				chosen_tile: (context) => null,
				compare_tile: (context) => null,
				guesses: (context) => context.guesses + 1,
			}),
			CORRECT_GUESS: assign({
				pairs_left: (context) => context.pairs_left - 2,
			}),
			LOAD_GAME: assign({
				tiles: (context, event) => event.tiles,
				pairs_left: (context, event) => event.tiles.length / 2,
			}),
		},
	}
);

export default memoryGameMachine;
