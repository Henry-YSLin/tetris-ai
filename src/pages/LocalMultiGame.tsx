import React, { useEffect, useState } from 'react';
import Sketch from 'react-p5';
import { useStates } from 'use-states';
import Player from '../tetris/player/Player';
import HumanPlayer from '../tetris/player/HumanPlayer';
import LocalMutiplayerGame from '../tetris/game/LocalMultiplayerGame';
import MultiplayerMainRenderer from '../tetris/renderer/MultiplayerMainRenderer';
import MultiplayerSpectatingRenderer from '../tetris/renderer/MultiplayerSpectatingRenderer';
import Renderer from '../tetris/renderer/Renderer';
import HeightMapAI from '../tetris/player/ai/heightMap/HeightMapAI';
import MediumRenAI from '../tetris/player/ai/choiceRating/MediumRenAI';
import MediumTetrisAI from '../tetris/player/ai/choiceRating/MediumTetrisAI';
import BasicChoiceRatingAI from '../tetris/player/ai/choiceRating/BasicChoiceRatingAI';

export default function LocalMultiGame() {
  const [renderers, setRenderers] = useState<Renderer[]>();
  const data = useStates({
    rounds: 0,
    wins: null,
  });
  useEffect(() => {
    data.rounds++;
    const player1: Player = new HumanPlayer();
    const aiPlayers: Player[] = [];
    aiPlayers.push(new MediumRenAI());
    aiPlayers.push(new MediumTetrisAI());
    aiPlayers.push(new BasicChoiceRatingAI());
    aiPlayers.push(new HeightMapAI());
    const game: LocalMutiplayerGame = new LocalMutiplayerGame([
      { player: player1 },
      ...aiPlayers.map(p => ({ player: p })),
    ]);
    const renderer1: MultiplayerMainRenderer = new MultiplayerMainRenderer(game, game.Participants[0]);
    const aiRenderers: MultiplayerSpectatingRenderer[] = [];
    game.Participants.slice(1).forEach(p => aiRenderers.push(new MultiplayerSpectatingRenderer(game, p)));
    setRenderers([renderer1, ...aiRenderers]);
    setTimeout(() => game.StartClock(), 1000);
    game.GameEnded.once(() => {
      game.StopClock();
      setTimeout(() => {
        let w: number[] | null = data.wins?.slice();
        if (!w) w = new Array(game.Participants.length).fill(0);
        w[game.Participants.findIndex(p => !p.State.IsDead)]++;
        data.wins = w;
      }, 1000);
    });
    return () => {
      game.StopClock();
      setRenderers(undefined);
    };
  }, [data.wins]);
  return (
    <div className="min-h-screen w-screen relative">
      <p className="absolute top-0 left-0 z-10">Round {data.rounds}</p>
      <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center flex-wrap">
        {renderers?.map((r, idx) => (
          <div key={`${data.rounds}-${idx}`}>
            <Sketch
              setup={r.SetupHandler}
              draw={r.DrawHandler}
              keyPressed={r instanceof MultiplayerMainRenderer ? r.KeyPressedHandler : undefined}
              keyReleased={r instanceof MultiplayerMainRenderer ? r.KeyReleasedHandler : undefined}
            />
            <p>{data.wins ? `${data.wins[idx]} wins` : null}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
