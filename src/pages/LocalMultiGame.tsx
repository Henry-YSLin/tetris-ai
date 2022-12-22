import React, { useEffect, useState } from 'react';
import { useStates } from 'use-states';
import Sketch from 'react-p5';
import Player from '../tetris/player/Player';
import HumanPlayer from '../tetris/player/HumanPlayer';
import LocalMutiplayerGame from '../tetris/game/LocalMultiplayerGame';
import MultiplayerMainRenderer from '../tetris/renderer/MultiplayerMainRenderer';
import MultiplayerSpectatingRenderer from '../tetris/renderer/MultiplayerSpectatingRenderer';
import HeightMapAI from '../tetris/player/ai/heightMap/HeightMapAI';
import MediumRenAI from '../tetris/player/ai/choiceRating/MediumRenAI';
import MediumTetrisAI from '../tetris/player/ai/choiceRating/MediumTetrisAI';
import BasicChoiceRatingAI from '../tetris/player/ai/choiceRating/BasicChoiceRatingAI';
import RenderHost from '../tetris/renderer/RenderHost';
import RenderConfiguration from '../tetris/renderer/RenderConfiguration';
import Vector from '../tetris/utils/Vector';

export default function LocalMultiGame() {
  const [renderers, setRenderers] = useState<RenderHost[]>();
  const data = useStates({
    rounds: 0,
    wins: null,
  });
  useEffect(() => {
    data.rounds++;
    const seed = Math.floor(Math.random() * 2 ** 32);
    const player1: Player = new HumanPlayer();
    const aiPlayers: Player[] = [];
    aiPlayers.push(new MediumRenAI());
    aiPlayers.push(new MediumTetrisAI());
    aiPlayers.push(new BasicChoiceRatingAI());
    aiPlayers.push(new HeightMapAI());
    const game: LocalMutiplayerGame = new LocalMutiplayerGame([
      { player: player1, seed },
      ...aiPlayers.map(p => ({ player: p, seed })),
    ]);
    const renderer1: RenderHost = new RenderHost(
      new MultiplayerMainRenderer(game, game.Participants[0]),
      new RenderConfiguration()
    );
    const aiRenderers: RenderHost[] = [];
    game.Participants.slice(1).forEach(p =>
      aiRenderers.push(
        new RenderHost(
          new MultiplayerSpectatingRenderer(game, p).With(c => {
            c.Scale = new Vector(0.5, 0.5);
          }),
          new RenderConfiguration({ soundVolume: 0.1, width: 220, height: 251 })
        )
      )
    );
    setRenderers([renderer1, ...aiRenderers]);
    setTimeout(() => game.StartClock(), 1000);
    game.GameEnded.Once(() => {
      game.StopClock();
      setTimeout(() => {
        let w: number[] | null = data.wins?.slice();
        if (!w) w = new Array(game.Participants.length).fill(0);
        w[game.Participants.findIndex(p => !p.state.IsDead)]++;
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
          // todo: use a better key
          // eslint-disable-next-line react/no-array-index-key
          <div key={`${data.rounds}-${idx}`}>
            <Sketch
              setup={r.SetupHandler}
              draw={r.DrawHandler}
              keyPressed={r.KeyPressedHandler}
              keyReleased={r.KeyReleasedHandler}
            />
            <p>{data.wins ? `${data.wins[idx]} wins` : null}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
