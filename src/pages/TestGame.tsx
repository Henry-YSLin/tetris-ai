import React, { useEffect } from 'react';
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
import { GRID_HEIGHT, PLAYFIELD_HEIGHT } from '../tetris/Consts';

interface Props {}

const BLOCK_SIZE = 20;
const KEY_REPEAT_DELAY = 10;

const player: Player = new HumanPlayer();
const game: SingleplayerGame = new SingleplayerGame(player);
let keyHold: GameInput;
let keyDelay = 0;
game.StartClock();

const TestGame: React.FC = (props: Props) => {

	const setup = (p5: p5Types, canvasParentRef: Element) => {
		p5.createCanvas(500, BLOCK_SIZE * PLAYFIELD_HEIGHT + BLOCK_SIZE * 0.1).parent(canvasParentRef);
	};

	const draw = (p5: p5Types) => {
		if (keyHold !== GameInput.None) {
			if (player instanceof HumanPlayer) {
				if (keyDelay <= 0) {
					player.Enqueue(keyHold);
					keyDelay = KEY_REPEAT_DELAY;
				}
				keyDelay--;
			}
		}
		p5.translate(120, -(GRID_HEIGHT - PLAYFIELD_HEIGHT - 0.1) * BLOCK_SIZE);
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
		for (let i = 0; i < state.PieceQueue.length; i++) {
			const points = Tetrominos[state.PieceQueue[i]].Rotations[0].map(p => p.Add(new Point(12, 15 - i * 4)));
			drawTetromino(p5, state.PieceQueue[i], points, 255);
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
			const points = Tetrominos[state.Hold].Rotations[0].map(p => p.Add(new Point(-5, 15)));
			drawTetromino(p5, state.Hold, points, 255);
		}
	};

	const keyPressed = (p5: p5Types) => {
		if (!(player instanceof HumanPlayer)) return;
		if (p5.keyCode === p5.LEFT_ARROW)
			keyHold = GameInput.ShiftLeft;
		if (p5.keyCode === p5.RIGHT_ARROW)
			keyHold = GameInput.ShiftRight;
		if (p5.keyCode === p5.UP_ARROW)
			keyHold = GameInput.RotateCW;
		if (p5.keyCode === p5.CONTROL)
			keyHold = GameInput.RotateCCW;
		if (p5.keyCode === p5.DOWN_ARROW)
			keyHold = GameInput.SoftDrop;
		if (p5.keyCode === p5.SHIFT)
			keyHold = GameInput.Hold;
		if (p5.key === ' ')
			keyHold = GameInput.HardDrop;
		player.Enqueue(keyHold);
		keyDelay = KEY_REPEAT_DELAY;
	};

	const keyReleased = (p5: p5Types) => {
		if (!(player instanceof HumanPlayer)) return;
		let currentKey: GameInput = GameInput.None;
		if (p5.keyCode === p5.LEFT_ARROW)
			currentKey = GameInput.ShiftLeft;
		if (p5.keyCode === p5.RIGHT_ARROW)
			currentKey = GameInput.ShiftRight;
		if (p5.keyCode === p5.UP_ARROW)
			currentKey = GameInput.RotateCW;
		if (p5.keyCode === p5.CONTROL)
			currentKey = GameInput.RotateCCW;
		if (p5.keyCode === p5.DOWN_ARROW)
			currentKey = GameInput.SoftDrop;
		if (p5.keyCode === p5.SHIFT)
			currentKey = GameInput.Hold;
		if (p5.key === ' ')
			currentKey = GameInput.HardDrop;
		if (keyHold === currentKey)
			keyHold = GameInput.None;
	};

	return <Sketch setup={setup} draw={draw} keyPressed={keyPressed} keyReleased={keyReleased} />;
};

export default TestGame;
