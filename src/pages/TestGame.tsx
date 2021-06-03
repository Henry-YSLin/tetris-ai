import React, { useEffect, useState } from 'react';
import Player from '../tetris/player/Player';
import SingleplayerGame from '../tetris/game/SingleplayerGame';
import Sketch from 'react-p5';
import HumanPlayer from '../tetris/player/HumanPlayer';
import SingleplayerRenderer from '../tetris/renderer/SingleplayerRenderer';

interface Props {}


const TestGame: React.FC = (props: Props) => {
	const [, setPlayer] = useState<Player>();
	const [, setGame] = useState<SingleplayerGame>();
	const [renderer, setRenderer] = useState<SingleplayerRenderer>();
	useEffect(() => {
		const _player: Player = new HumanPlayer();
		const _game: SingleplayerGame = new SingleplayerGame(_player);
		const _renderer: SingleplayerRenderer = new SingleplayerRenderer(_game);
		setPlayer(_player);
		setGame(_game);
		setRenderer(_renderer);
		setTimeout(() => _game.StartClock(), 1000);
		return () => {
			_game.StopClock();
		};
	}, []);
	if (renderer)
		return (
			<div className="min-h-screen w-screen flex justify-center items-center">
				<Sketch
					setup={renderer.SetupHandler}
					draw={renderer.DrawHandler}
					keyPressed={renderer.KeyPressedHandler}
					keyReleased={renderer.KeyReleasedHandler}
				/>
			</div>
		);
	else
		return <p>Loading</p>;
};

export default TestGame;
