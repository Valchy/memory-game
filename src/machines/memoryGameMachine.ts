import { createMachine, assign } from 'xstate';
import type { Context, FIX_ME_PLS } from '@mytypes';

// Check if tile is active or guessed (aka opened)
const isActive = (context: Context, event: FIX_ME_PLS): boolean => context.tiles[event.index].active || context.tiles[event.index].guessed;

// Check if a correct guess was made
const isCorrectGuess = (context: Context): boolean => {
	if (context.first_selected_tile === null || context.second_selected_tile === null) return false;
	return context.tiles[context.first_selected_tile].value == context.tiles[context.second_selected_tile].value;
};

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
								checkForLastPair: true,
							},
							actions: 'DO_GUESS',
							target: 'game_over',
						},
						{
							cond: {
								type: 'shouldGuess',
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
					let correctGuess = isCorrectGuess(context);

					// Remove chosen tile active state
					shallowCopyContext[context.first_selected_tile] = {
						...shallowCopyContext[context.first_selected_tile],
						active: correctGuess,
						guessed: correctGuess,
					};

					// Remove compare tile active state
					shallowCopyContext[context.second_selected_tile] = {
						...shallowCopyContext[context.second_selected_tile],
						active: correctGuess,
						guessed: correctGuess,
					};

					return shallowCopyContext;
				},
				pairs_left: (context) => (isCorrectGuess(context) ? context.pairs_left - 1 : context.pairs_left),
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

				// Error handling for game end
				if (cond.checkForLastPair && context.pairs_left != 1) return false;

				console.log('Guess allowed', cond.checkForMatch, context);
				return true;
			},
		},
	}
);

export default memoryGameMachine;
