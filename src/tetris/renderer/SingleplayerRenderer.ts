import GameStateUsable from './GameStateUsable';
import PlayerUsable from './PlayerUsable';
import GameUsable from './GameUsable';
import PlayfieldDrawable from './PlayfieldDrawable';
import HoldPieceDrawable from './HoldPieceDrawable';
import PieceQueueDrawable from './PieceQueueDrawable';
import FramerateDrawable from './FramerateDrawable';
import InputHandleable from './InputHandleable';
import BlockSizeConfigurable from './BlockSizeConfigurable';
import PlayfieldAnimatable from './PlayfieldAnimatable';
import PlayerSfxPlayable from './PlayerSfxPlayable';
import AchievementSfxPlayable from './AchievementSfxPlayable';
import AchievementVoicePlayable from './AchievementVoicePlayable';
import AchievementTextDrawable from './AchievementTextDrawable';
import Renderer from './Renderer';
import { BLOCK_SIZE, PLAYFIELD_HEIGHT } from '../Consts';
import Vector from '../utils/Vector';
import SingleplayerGame from '../game/SingleplayerGame';
export default class SingleplayerRenderer
extends
  FramerateDrawable(
  PieceQueueDrawable(
  HoldPieceDrawable(
  PlayfieldDrawable(
  AchievementTextDrawable(
  AchievementSfxPlayable(
  AchievementVoicePlayable(
  PlayerSfxPlayable(
  PlayfieldAnimatable(
  BlockSizeConfigurable(
  InputHandleable(
  GameUsable(
  PlayerUsable(
  GameStateUsable(
    Renderer))))))))))))))
{
  constructor(game: SingleplayerGame, width?: number, height?: number) {
    if (width && height)
      super(width, height);
    else
      super();
    this.ConfigureGameState(game.State);
    this.ConfigurePlayer(game.Player);
    this.ConfigureGame(game);
    this.ConfigureBlockSize(BLOCK_SIZE);
    this.ConfigurePlayfieldAnimatable();
    this.ConfigurePlayerSfxPlayable();
    this.ConfigureAchievementSfxPlayable();
    this.ConfigureAchievementVoicePlayable();
    this.ConfigureAchievementTextDrawable(new Vector(this.BlockSize * 11, this.BlockSize * ((this.State?.PlayfieldHeight ?? PLAYFIELD_HEIGHT) + 1)), new Vector(1, 1));
    this.ConfigurePlayfieldDrawable(new Vector(this.BlockSize * 6, 0), new Vector(1, 1));
    this.ConfigureHoldPieceDrawable(new Vector(10, 200), new Vector(1, 1));
    this.ConfigurePieceQueueDrawable(new Vector(this.BlockSize * 17, 100), new Vector(0.7, 0.7));
    this.ConfigureFramerateDrawable(new Vector(0, this.height - 10), new Vector(1, 1));
  }
}