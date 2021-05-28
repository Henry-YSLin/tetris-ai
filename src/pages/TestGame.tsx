import React, { useEffect } from 'react';
import TestGrid from '../components/game/TestGrid';
import FastestTopOutAI from '../tetris/player/FastestTopOutAI';
import Player from '../tetris/player/Player';
import SingleplayerGame from '../tetris/SingleplayerGame';
import Sketch from 'react-p5';
import p5Types from 'p5'; //Import this for typechecking and intellisense
import { Tetromino, TetrominoColor } from '../tetris/Tetrominos';
import IdleAI from '../tetris/player/IdleAI';
import RandomAI from '../tetris/player/RandomAI';

interface Props {}

const BLOCK_SIZE = 30;

const player: Player = new RandomAI();
const game: SingleplayerGame = new SingleplayerGame(player);
game.StartClock();

const TestGame: React.FC = (props: Props) => {

	const setup = (p5: p5Types, canvasParentRef: Element) => {
		p5.createCanvas(500, 1500).parent(canvasParentRef);
	};

	const draw = (p5: p5Types) => {
		p5.background(200);
		const state = game.State;
		if (!state) return;
		p5.stroke(0);
		for (let i = 0; i <= state.GridHeight; i++) {
			p5.line(0, i * BLOCK_SIZE, state.GridWidth * BLOCK_SIZE, i * BLOCK_SIZE);
		}
		for (let i = 0; i <= state.GridWidth; i++) {
			p5.line(i * BLOCK_SIZE, 0, i * BLOCK_SIZE, state.GridHeight * BLOCK_SIZE);
		}
		for (let i = 0; i < state.GridHeight; i++) {
			for (let j = 0; j < state.GridWidth; j++) {
				p5.fill(TetrominoColor(p5, state.Get(j, i) ?? Tetromino.None));
				p5.rect(j * BLOCK_SIZE, (state.GridHeight - i - 1) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
			}
		}
		if (state.Falling){
			const falling = state.Falling.Points;
			falling.forEach(p => {
				p5.fill(TetrominoColor(p5, state.Falling?.Type ?? Tetromino.None));
				p5.rect(p.X * BLOCK_SIZE, (state.GridHeight - p.Y - 1) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
			});
		}

	};

	return <Sketch setup={setup} draw={draw} />;
};

export default TestGame;
