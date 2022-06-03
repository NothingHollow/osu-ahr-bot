import { Lobby } from '../Lobby';
import { Player, revealUserName, disguiseUserName } from '../Player';
import { LobbyPlugin } from './LobbyPlugin';

export class PlayerInteractor extends LobbyPlugin {

  constructor(lobby: Lobby) {
    super(lobby, 'PlayerInteractor', 'interactor');
    this.lobby.PlayerJoined.on(a => this.onPlayerJoined(a.player));
    this.lobby.PlayerLeft.on(a => this.onPlayerLeft(a.player));
  }

  private onPlayerJoined(player: Player) {
    this.lobby.SendMessageWithCoolTime(() => {
      return `${player.name} さんが入室しました。 (has entered the room)`;
    }, 'welcome', 5000);
  }

  private onPlayerLeft(player: Player) {
    this.lobby.SendMessageWithCoolTime(() => {
      return `${player.name} さんが退室しました。 (has left the room)`;
    }, 'goodbye', 5000);
  }
}