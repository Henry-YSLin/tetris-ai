import React from 'react';
import Player from '../tetris/player/Player';
import SingleplayerGame from '../tetris/game/SingleplayerGame';
import Sketch from 'react-p5';
import IdleAI from '../tetris/player/IdleAI';
import RandomAI from '../tetris/player/RandomAI';
import TopOutAI from '../tetris/player/TopOutAI';
import HumanPlayer from '../tetris/player/HumanPlayer';
import SingleplayerRenderer from '../tetris/renderer/SingleplayerRenderer';

interface Props {}

const player: Player = new HumanPlayer();
const game: SingleplayerGame = new SingleplayerGame(player);
const renderer: SingleplayerRenderer = new SingleplayerRenderer(game);
console.log(renderer);
game.StartClock();

const TestGame: React.FC = (props: Props) => {
	return <Sketch
		setup={renderer.SetupHandler}
		draw={renderer.DrawHandler}
		keyPressed={renderer.KeyPressedHandler}
		keyReleased={renderer.KeyReleasedHandler}
	/>;
};

export default TestGame;
