import MultiGameStateUsable from './MultiGameStateUsable';
import PlayerUsable from './PlayerUsable';
import GameUsable from './GameUsable';
import PlayfieldDrawable from './PlayfieldDrawable';
import HoldPieceDrawable from './HoldPieceDrawable';
import PieceQueueDrawable from './PieceQueueDrawable';
import FramerateDrawable from './FramerateDrawable';
import BlockSizeConfigurable from './BlockSizeConfigurable';
import PlayfieldAnimatable from './PlayfieldAnimatable';
import PlayerSfxPlayable from './PlayerSfxPlayable';
import GameEventSfxPlayable from './GameEventSfxPlayable';
import GameEventVoicePlayable from './GameEventVoicePlayable';
import GameEventTextDrawable from './GameEventTextDrawable';
import GarbageMeterDrawable from './GarbageMeterDrawable';
import Renderer from './Renderer';
import { BLOCK_SIZE, PLAYFIELD_HEIGHT, SOUND_VOLUME } from '../Consts';
import Vector from '../utils/Vector';
import p5Types from 'p5';
import MultiplayerGame, { Participant } from '../game/MultiplayerGame';

export default class MultiplayerSpectatingRenderer
extends
  FramerateDrawable(
  GarbageMeterDrawable(
  PieceQueueDrawable(
  HoldPieceDrawable(
  PlayfieldDrawable(
  GameEventTextDrawable(
  GameEventSfxPlayable(
  GameEventVoicePlayable(
  PlayerSfxPlayable(
  PlayfieldAnimatable(
  BlockSizeConfigurable(
  GameUsable(
  PlayerUsable(
  MultiGameStateUsable(
    Renderer))))))))))))))
{
  constructor(game: MultiplayerGame, participant: Participant, width?: number, height?: number) {
    if (width && height)
      super(width, height);
    else
      super(BLOCK_SIZE * 11,  BLOCK_SIZE * (PLAYFIELD_HEIGHT + 0.1) / 2 + 50);
    this.ConfigureGameState(participant.State);
    this.ConfigurePlayer(participant.Player);
    this.ConfigureGame(game);
    this.ConfigureBlockSize(BLOCK_SIZE);
    this.ConfigurePlayfieldAnimatable();
    this.ConfigurePlayerSfxPlayable(SOUND_VOLUME / 2);
    this.ConfigureGameEventSfxPlayable(SOUND_VOLUME / 2);
    this.ConfigureGameEventVoicePlayable(SOUND_VOLUME / 2);
    this.ConfigureGameEventTextDrawable(new Vector(this.BlockSize * 11, this.BlockSize * ((this.State?.PlayfieldHeight ?? PLAYFIELD_HEIGHT) + 1)), new Vector(1, 1));
    this.ConfigurePlayfieldDrawable(new Vector(this.BlockSize * 6, 0), new Vector(1, 1));
    this.ConfigureHoldPieceDrawable(new Vector(10, 200), new Vector(1, 1));
    this.ConfigurePieceQueueDrawable(new Vector(this.BlockSize * 18, 100), new Vector(0.7, 0.7));
    this.ConfigureGarbageMeterDrawable(new Vector(this.BlockSize * 16.5, 0), new Vector(1, 1));
    this.ConfigureFramerateDrawable(new Vector(0, this.height - 10), new Vector(1, 1));
  }

  ResetTransform(p5: p5Types): void {
    p5.resetMatrix();
		p5.scale(1, -1);
		p5.translate(0, -this.height);
    p5.scale(0.5, 0.5);
  }
}