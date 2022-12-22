import React, { useEffect, useState } from 'react';
import Sketch from 'react-p5';
import Player from '../tetris/player/Player';
import HumanPlayer from '../tetris/player/HumanPlayer';
import SingleplayerGame from '../tetris/game/SingleplayerGame';
import SingleplayerRenderer from '../tetris/renderer/SingleplayerRenderer';
import RenderHost from '../tetris/renderer/RenderHost';
import RenderConfiguration from '../tetris/renderer/RenderConfiguration';

export default function TestGame() {
  const [, setPlayer] = useState<Player>();
  const [, setGame] = useState<SingleplayerGame>();
  const [renderer, setRenderer] = useState<RenderHost>();
  useEffect(() => {
    const player: Player = new HumanPlayer();
    const game: SingleplayerGame = new SingleplayerGame(player);
    const renderHost: RenderHost = new RenderHost(new SingleplayerRenderer(game), new RenderConfiguration());
    setPlayer(player);
    setGame(game);
    setRenderer(renderHost);
    setTimeout(() => game.StartClock(), 1000);
    return () => {
      game.StopClock();
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
  return <p>Loading</p>;
}
