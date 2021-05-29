import React, { useEffect } from 'react';
import TestGrid from '../components/game/TestGrid';
import FastestTopOutAI from '../tetris/player/FastestTopOutAI';
import Player from '../tetris/player/Player';
import SingleplayerGame from '../tetris/SingleplayerGame';
import Sketch from 'react-p5';
import p5Types from 'p5'; //Import this for typechecking and intellisense
import Tetrominos, { Tetromino, TetrominoColor } from '../tetris/Tetrominos';
import IdleAI from '../tetris/player/IdleAI';
import RandomAI from '../tetris/player/RandomAI';
import HumanPlayer from '../tetris/player/HumanPlayer';
import GameInput from '../tetris/GameInput';
import Point from '../tetris/utils/Point';

interface Props {}

const BLOCK_SIZE = 15;

const player: Player = new HumanPlayer();
const game: SingleplayerGame = new SingleplayerGame(player);
game.StartClock();

const TestGame: React.FC = (props: Props) => {

	const setup = (p5: p5Types, canvasParentRef: Element) => {
		p5.createCanvas(500, 700).parent(canvasParentRef);
	};

	const draw = (p5: p5Types) => {
		const drawTetromino = (p5: p5Types, type: Tetromino | null, points: Point[], alpha: number) => {
			const c = TetrominoColor(p5, type ?? Tetromino.None);
			c.setAlpha(alpha);
			p5.fill(c);
			points.forEach(p => {
				p5.rect(p.X * BLOCK_SIZE, (state.GridHeight - p.Y - 1) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
			});
		};

		p5.background(100);
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
		if (state.Falling) {
			const falling = state.Falling.Points;
			drawTetromino(p5, state.Falling?.Type, falling, 255);
			const ghost = state.Falling.Clone();
			state.HardDropPiece(ghost);
			const ghostPoints = ghost.Points;
			drawTetromino(p5, state.Falling?.Type, ghostPoints, 100);
		}
		if (state.Hold) {
			const points = Tetrominos[state.Hold].Rotations[0].map(p => p.Add(new Point(12, 15)));
			drawTetromino(p5, state.Hold, points, 255);
		}
	};

	const keyPressed = (p5: p5Types) => {
		if (!(player instanceof HumanPlayer)) return;
		if (p5.keyCode === p5.LEFT_ARROW)
			player.Enqueue(GameInput.ShiftLeft);
		if (p5.keyCode === p5.RIGHT_ARROW)
			player.Enqueue(GameInput.ShiftRight);
		if (p5.keyCode === p5.UP_ARROW)
			player.Enqueue(GameInput.RotateCW);
		if (p5.keyCode === p5.CONTROL)
			player.Enqueue(GameInput.RotateCCW);
		if (p5.keyCode === p5.DOWN_ARROW)
			player.Enqueue(GameInput.SoftDrop);
		if (p5.keyCode === p5.SHIFT)
			player.Enqueue(GameInput.Hold);
		if (p5.key === ' ')
			player.Enqueue(GameInput.HardDrop);
	};

	return <Sketch setup={setup} draw={draw} keyPressed={keyPressed} />;
};

export default TestGame;
