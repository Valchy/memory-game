import { createMachine, assign } from 'xstate';
import type { Context, FIX_ME_PLS } from '@mytypes';

const isActive = (context: Context, event: FIX_ME_PLS) => context.tiles[event.index].active || context.tiles[event.index].guessed;

const memoryGameMachine = createMachine<Context>(
	{
		id: 'memory_game',
		initial: 'idle',
		context: {
			game_time: 0,
			guesses: 0,
			tiles: [],
			pairs_left: 0,
			first_selected_tile: null,
			second_selected_tile: null,
			is_first_pick: true,
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
					TOGGLE_TILE: {
						cond: 'isGuessing',
						actions: assign({
							tiles: (context, event) => {
								if (isActive(context, event)) return context.tiles;

								let shallowCopyContext = [...context.tiles];

								shallowCopyContext[event.index] = {
									...shallowCopyContext[event.index],
									active: !shallowCopyContext[event.index].active,
								};

								return shallowCopyContext;
							},
							first_selected_tile: (context, event) => {
								if (isActive(context, event) || !context.is_first_pick) return context.first_selected_tile;

								return event.index;
							},
							second_selected_tile: (context, event) => {
								if (isActive(context, event) || context.is_first_pick || context.first_selected_tile === event.index)
									return context.second_selected_tile;

								return event.index;
							},
							is_first_pick: (context) => !context.is_first_pick,
						}),
					},
					GUESS: [
						{
							cond: {
								type: 'shouldGuess',
								checkForMatch: true,
								checkForLastPair: true,
							},
							actions: ['DO_GUESS', 'CORRECT_GUES'],
							target: 'game_over',
						},
						{
							cond: {
								type: 'shouldGuess',
								checkForMatch: true,
								checkForLastPair: false,
							},
							actions: ['DO_GUESS', 'CORRECT_GUESS'],
						},
						{
							cond: {
								type: 'shouldGuess',
								checkForMatch: false,
								checkForLastPair: false,
							},
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
				pairs_left: (context) => 0,
			}),
			DO_GUESS: assign({
				first_selected_tile: (context) => null,
				second_selected_tile: (context) => null,
				guesses: (context) => context.guesses + 1,
				tiles: (context, event) => {
					if (context.first_selected_tile === null || context.second_selected_tile === null) return context.tiles;
					let shallowCopyContext = [...context.tiles];

					// Remove chosen tile active state
					shallowCopyContext[context.first_selected_tile] = {
						...shallowCopyContext[context.first_selected_tile],
						active: false,
					};

					// Remove compare tile active state
					shallowCopyContext[context.second_selected_tile] = {
						...shallowCopyContext[context.second_selected_tile],
						active: false,
					};

					return shallowCopyContext;
				},
			}),
			CORRECT_GUESS: assign({
				pairs_left: (context) => context.pairs_left - 1,
				tiles: (context, event) => {
					if (context.first_selected_tile === null || context.second_selected_tile === null) return context.tiles;
					let shallowCopyContext = [...context.tiles];

					// Make chosen tile to guessed state
					shallowCopyContext[context.first_selected_tile] = {
						...shallowCopyContext[context.first_selected_tile],
						guessed: !shallowCopyContext[context.first_selected_tile].guessed,
					};

					// Make compare tile to guessed state
					shallowCopyContext[context.second_selected_tile] = {
						...shallowCopyContext[context.second_selected_tile],
						guessed: !shallowCopyContext[context.second_selected_tile].guessed,
					};

					return shallowCopyContext;
				},
			}),
			LOAD_GAME: assign({
				tiles: (context, event) => event.tiles,
				pairs_left: (context, event) => event.tiles.length / 2,
			}),
		},
		guards: {
			isGuessing: (context) => context.first_selected_tile === null || context.second_selected_tile === null,
			shouldGuess: (context, event, { cond }: FIX_ME_PLS): boolean => {
				// Make sure both tiles have an index in them
				if (context.first_selected_tile === null || context.second_selected_tile === null) return false;

				// Get tile values for comparison
				let firstTileVal = context.tiles[context.first_selected_tile];
				let secondTileVal = context.tiles[context.second_selected_tile];

				// Error handling for game end and correct guess
				if (cond.checkForMatch && firstTileVal != secondTileVal) return false;
				if (cond.checkForLastPair && context.pairs_left != 1) return false;

				console.log('Guess allowed', cond.checkForMatch, context);
				return true;
			},
		},
	}
);

export default memoryGameMachine;
