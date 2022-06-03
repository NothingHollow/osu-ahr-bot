import { Lobby } from '../Lobby';
import { LobbyPlugin } from './LobbyPlugin';
import { Player } from '../Player';
import UserSchema from '../models/User';

export class BotCommand extends LobbyPlugin {

  constructor(lobby: Lobby) {
    super(lobby, 'BotCommand', 'command');
    this.lobby.ReceivedChatCommand.on(a => this.onChatCommand(a.player, a.command, a.param));
  }

  private onChatCommand(player: Player, command: string, param: string): void {
    if (command.startsWith('!p')) {
      this.showUserProfile(player, param);
    }
    else if (player.isCreator && command.startsWith('$eval')) {
      this.evaluate(param);
    }
  }

  private async showUserProfile(player: Player, param: string): Promise<void> {

    // const target = param || player.id

    const user = await UserSchema.findOne({ User: player.id });

    if (!user) {
      this.lobby.SendMessageWithCoolTime('User not found, play some maps to create your profile!', 'profilemessage', 5000);
      return;
    }

    const time = secondsToDhms(user.playTime);

    this.lobby.SendMessageWithCoolTime(`User: [https://osu.ppy.sh/u/${user.User} ${player.name}] [#${user.User}] | Score: ${user.score.toLocaleString()} | Playcount: ${user.playCount} | Playtime: ${time} | Passed: ${user.passedCount} | Unpassed: ${user.playCount - user.passedCount}`, 'profilemessage', 5000);
  }

  private async evaluate(param: string) {
    try {
      const result = await eval(param);
      this.lobby.SendMessageWithCoolTime(result, 'eval', 5000);
    }
    catch (e) {
      this.lobby.SendMessageWithCoolTime('Error occured', 'eval', 5000);
      console.log(e);
    }
  }
}

function secondsToDhms(seconds: number) {
  seconds = Number(seconds);
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor(seconds % (3600 * 24) / 3600);
  const m = Math.floor(seconds % 3600 / 60);
  const s = Math.floor(seconds % 60);

  const dDisplay = d > 0 ? d + (d === 1 ? ' day, ' : ' days, ') : '';
  const hDisplay = h > 0 ? h + (h === 1 ? ' hour, ' : ' hours, ') : '';
  const mDisplay = m > 0 ? m + (m === 1 ? ' minute, ' : ' minutes, ') : '';
  const sDisplay = s > 0 ? s + (s === 1 ? ' second' : ' seconds') : '';
  return dDisplay + hDisplay + mDisplay + sDisplay;
}