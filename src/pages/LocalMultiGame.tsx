import React, { useEffect, useState } from 'react';
import Player from '../tetris/player/Player';
import Sketch from 'react-p5';
import HumanPlayer from '../tetris/player/HumanPlayer';
import LocalMutiplayerGame from '../tetris/game/LocalMultiplayerGame';
import MultiplayerMainRenderer from '../tetris/renderer/MultiplayerMainRenderer';
import MultiplayerSpectatingRenderer from '../tetris/renderer/MultiplayerSpectatingRenderer';
import Renderer from '../tetris/renderer/Renderer';
import HeightMapAI from '../tetris/player/EasyAI';
import ChoiceRatingAI from '../tetris/player/ChoiceRatingAI';
import MediumRenAI from '../tetris/player/MediumRenAI';
import { useStates } from 'use-states';

interface Props {}


const LocalMultiGame: React.FC = (props: Props) => {
	const [renderers, setRenderers] = useState<Renderer[]>();
	const data = useStates({
		rounds: 0,
		wins: null,
	});
	useEffect(() => {
		data.rounds++;
		const _player1: Player = new HumanPlayer();
		const _AIPlayers: Player[] = [];
		_AIPlayers.push(new MediumRenAI());
 		const _game: LocalMutiplayerGame = new LocalMutiplayerGame([{ player:_player1 }, ..._AIPlayers.map(p => ({ player: p }))]);
		const _renderer1: MultiplayerMainRenderer = new MultiplayerMainRenderer(_game, _game.Participants[0]);
		const _AIRenderers: MultiplayerSpectatingRenderer[] = [];
		_game.Participants.slice(1).forEach(p => _AIRenderers.push(new MultiplayerSpectatingRenderer(_game, p)));
		setRenderers([_renderer1, ..._AIRenderers]);
		setTimeout(() => _game.StartClock(), 1000);
		_game.GameEnded.once(() => {
			_game.StopClock();
			setTimeout(() => {
				let w: number[] | null = data.wins?.slice();
				if (!w) w = new Array(_game.Participants.length).fill(0);
				w[_game.Participants.findIndex(p => !p.State.IsDead)]++;
				data.wins = w;
			}, 1000);
		});
		return () => {
			setRenderers(undefined);
		};
	}, [data.wins]);
	return (
		<div className="min-h-screen w-screen relative">
			<p className="absolute top-0 left-0 z-10">Round {data.rounds}</p>
			<div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center flex-wrap">
				{renderers?.map((r, idx) => <div key={`${data.rounds}-${idx}`}>
					<Sketch
						setup={r.SetupHandler}
						draw={r.DrawHandler}
						keyPressed={r instanceof MultiplayerMainRenderer ? r.KeyPressedHandler : undefined}
						keyReleased={r instanceof MultiplayerMainRenderer ? r.KeyReleasedHandler : undefined}
					/>
					<p>{data.wins ? `${data.wins[idx]} wins` : null}</p>
				</div>)}
			</div>
		</div>
	);
};

export default LocalMultiGame;
