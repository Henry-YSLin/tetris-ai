import React, { useEffect, useState } from 'react';
import Sketch from 'react-p5';
import Player from '../tetris/player/Player';
import HumanPlayer from '../tetris/player/HumanPlayer';
import SingleplayerGame from '../tetris/game/SingleplayerGame';
import SingleplayerRenderer from '../tetris/renderer/SingleplayerRenderer';
import RenderHost from '../tetris/renderer/RenderHost';
import LocalConfiguration from '../tetris/renderer/LocalConfiguration';
import GlobalConfiguration from '../tetris/GlobalConfiguration';

export default function SoloGame() {
  const [, setPlayer] = useState<Player>();
  const [, setGame] = useState<SingleplayerGame>();
  const [renderer, setRenderer] = useState<RenderHost>();
  useEffect(() => {
    const player: Player = new HumanPlayer();
    const game: SingleplayerGame = new SingleplayerGame(new GlobalConfiguration(), player);
    const renderHost: RenderHost = new RenderHost(new SingleplayerRenderer(game), new LocalConfiguration());
    setPlayer(player);
    setGame(game);
    setRenderer(renderHost);
    game.StartGame();
  }, []);
  if (renderer)
    return (
      <div
        className="min-h-screen w-screen flex justify-center items-center"
        style={{ backgroundColor: renderer.LocalConfig.BackgroundColor }}
      >
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
