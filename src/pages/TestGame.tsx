import React, { useEffect, useState } from 'react';
import Player from '../tetris/player/Player';
import SingleplayerGame from '../tetris/game/SingleplayerGame';
import Sketch from 'react-p5';
import IdleAI from '../tetris/player/IdleAI';
import RandomAI from '../tetris/player/RandomAI';
import TopOutAI from '../tetris/player/TopOutAI';
import HumanPlayer from '../tetris/player/HumanPlayer';
import SingleplayerRenderer from '../tetris/renderer/SingleplayerRenderer';

interface Props {}


const TestGame: React.FC = (props: Props) => {
	const [player, setPlayer] = useState<Player>();
	const [game, setGame] = useState<SingleplayerGame>();
	const [renderer, setRenderer] = useState<SingleplayerRenderer>();
	useEffect(() => {
		const _player: Player = new HumanPlayer();
		const _game: SingleplayerGame = new SingleplayerGame(_player);
		const _renderer: SingleplayerRenderer = new SingleplayerRenderer(_game);
		setPlayer(_player);
		setGame(_game);
		setRenderer(_renderer);
		setTimeout(() => _game.StartClock(), 1000);
		console.log(_renderer);
		return () => {
			_game.StopClock();
		};
	}, []);
	if (renderer)
		return <Sketch
			setup={renderer.SetupHandler}
			draw={renderer.DrawHandler}
			keyPressed={renderer.KeyPressedHandler}
			keyReleased={renderer.KeyReleasedHandler}
		/>;
	else
		return <p>Loading</p>;
};

export default TestGame;
