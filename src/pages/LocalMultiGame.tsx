import React, { useEffect, useState } from 'react';
import Player from '../tetris/player/Player';
import Sketch from 'react-p5';
import HumanPlayer from '../tetris/player/HumanPlayer';
import LocalMutiplayerGame from '../tetris/game/LocalMultiplayerGame';
import MultiplayerMainRenderer from '../tetris/renderer/MultiplayerMainRenderer';
import MultiplayerSpectatingRenderer from '../tetris/renderer/MultiplayerSpectatingRenderer';
import Renderer from '../tetris/renderer/Renderer';
import DecentAI from '../tetris/player/DecentAI';

interface Props {}


const LocalMultiGame: React.FC = (props: Props) => {
	const [, setPlayers] = useState<Player[]>();
	const [, setGame] = useState<LocalMutiplayerGame>();
	const [renderers, setRenderers] = useState<Renderer[]>();
	useEffect(() => {
		const _player1: Player = new HumanPlayer();
		const _AIPlayers: Player[] = [];
		for (let i = 0; i < 3; i++) _AIPlayers.push(new DecentAI());
 		const _game: LocalMutiplayerGame = new LocalMutiplayerGame([{ player:_player1 }, ..._AIPlayers.map(p => ({ player: p }))]);
		const _renderer1: MultiplayerMainRenderer = new MultiplayerMainRenderer(_game, _game.Participants[0]);
		const _AIRenderers: MultiplayerSpectatingRenderer[] = [];
		_game.Participants.slice(1).forEach(p => _AIRenderers.push(new MultiplayerSpectatingRenderer(_game, p)));
		setPlayers([_player1, ..._AIPlayers]);
		setGame(_game);
		setRenderers([_renderer1, ..._AIRenderers]);
		setTimeout(() => _game.StartClock(), 1000);
		return () => {
			_game.StopClock();
		};
	}, []);
	return (
		<div className="min-h-screen w-screen flex justify-center items-center flex-wrap">
			{renderers?.map((r, idx) => <Sketch
				key={idx}
				setup={r.SetupHandler}
				draw={r.DrawHandler}
				keyPressed={r instanceof MultiplayerMainRenderer ? r.KeyPressedHandler : undefined}
				keyReleased={r instanceof MultiplayerMainRenderer ? r.KeyReleasedHandler : undefined}
			/>)}
		</div>
	);
};

export default LocalMultiGame;
