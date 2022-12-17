import React, { useEffect, useState } from 'react';
import Sketch from 'react-p5';
import Player from '../tetris/player/Player';
import SingleplayerGame from '../tetris/game/SingleplayerGame';
import HumanPlayer from '../tetris/player/HumanPlayer';
import SingleplayerRenderer from '../tetris/renderer/SingleplayerRenderer';

export default function TestGame() {
  const [, setPlayer] = useState<Player>();
  const [, setGame] = useState<SingleplayerGame>();
  const [renderer, setRenderer] = useState<SingleplayerRenderer>();
  useEffect(() => {
    const player: Player = new HumanPlayer();
    const game: SingleplayerGame = new SingleplayerGame(player);
    const singleplayerRenderer: SingleplayerRenderer = new SingleplayerRenderer(game);
    setPlayer(player);
    setGame(game);
    setRenderer(singleplayerRenderer);
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
