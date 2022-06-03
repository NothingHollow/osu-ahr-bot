import { Lobby } from '../Lobby';
import { Player } from '../Player';
import { LobbyPlugin } from './LobbyPlugin';
import UserSchema from '../models/User';

export class StatSaver extends LobbyPlugin {

  constructor(lobby: Lobby) {
    super(lobby, 'StatSaver', 'stat');
    this.lobby.PlayerFinished.on(a => this.saveStat(a.player, a.score, a.isPassed));
  }

  private async saveStat(player: Player, score: number, passed: boolean): Promise<void> {

    const user = await UserSchema.findOne({ User: player.id });

    if (user) {
      user.score += score;
      user.playCount++;
      user.playTime += this.lobby.mapDuration;
      if (passed) user.passedCount++;
      user.save();
    }
    else {
      const newUser = new UserSchema({
        User: player.id,
        score: score,
        playCount: 1,
        playTime: this.lobby.mapDuration,
        passedCount: passed ? 1 : 0
      });
      newUser.save();
    }
  }
}