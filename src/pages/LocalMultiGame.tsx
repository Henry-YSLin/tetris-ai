import React, { useEffect, useState } from 'react';
import Player from '../tetris/player/Player';
import Sketch from 'react-p5';
import HumanPlayer from '../tetris/player/HumanPlayer';
import LocalMutiplayerGame from '../tetris/game/LocalMultiplayerGame';
import IdleAI from '../tetris/player/IdleAI';
import MultiplayerMainRenderer from '../tetris/renderer/MultiplayerMainRenderer';
import MultiplayerSpectatingRenderer from '../tetris/renderer/MultiplayerSpectatingRenderer';

interface Props {}


const LocalMultiGame: React.FC = (props: Props) => {
	const [, setPlayer1] = useState<Player>();
	const [, setPlayer2] = useState<Player>();
	const [, setGame] = useState<LocalMutiplayerGame>();
	const [renderer1, setRenderer1] = useState<MultiplayerMainRenderer>();
	const [renderer2, setRenderer2] = useState<MultiplayerSpectatingRenderer>();
	useEffect(() => {
		const _player1: Player = new HumanPlayer();
		const _player2: Player = new IdleAI();
 		const _game: LocalMutiplayerGame = new LocalMutiplayerGame([{ player:_player1 }, { player:_player2 }]);
		const _renderer1: MultiplayerMainRenderer = new MultiplayerMainRenderer(_game, _game.Participants[0]);
		const _renderer2: MultiplayerSpectatingRenderer = new MultiplayerSpectatingRenderer(_game, _game.Participants[1]);
		setPlayer1(_player1);
		setPlayer2(_player2);
		setGame(_game);
		setRenderer1(_renderer1);
		setRenderer2(_renderer2);
		setTimeout(() => _game.StartClock(), 1000);
		return () => {
			_game.StopClock();
		};
	}, []);
	return (
		<div className="min-h-screen w-screen flex justify-center items-center">
			{renderer1
				? <Sketch
					setup={renderer1.SetupHandler}
					draw={renderer1.DrawHandler}
					keyPressed={renderer1.KeyPressedHandler}
					keyReleased={renderer1.KeyReleasedHandler}
				/>
				: null}
			{renderer2
				? <Sketch
					setup={renderer2.SetupHandler}
					draw={renderer2.DrawHandler}
				/>
				: null}
		</div>
	);
};

export default LocalMultiGame;
