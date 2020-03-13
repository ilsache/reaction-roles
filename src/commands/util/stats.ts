import { Command, version as akairoversion } from 'discord-akairo';
import { Message, version as djsversion } from 'discord.js';
import { stripIndents } from 'common-tags';
import * as moment from 'moment';
import 'moment-duration-format';

export default class StatsCommand extends Command {
	public constructor() {
		super('stats', {
			aliases: ['stats', 'uptime'],
			clientPermissions: ['EMBED_LINKS'],
			description: {
				content: 'Provides some stats on the bot.',
			},
			category: 'Utilities',
		});
	}

	public async exec(msg: Message): Promise<Message | Message[] | void> {
		const duration = moment.duration(this.client.uptime!).format(' D[d] H[h] m[m] s[s]');
		const embed = this.client.util
			.embed()
			.setTitle(`${this.client.user!.username} Stats`)
			.setThumbnail(this.client.user!.displayAvatarURL())
			.addField(`\`⏰\` Uptime`, duration)
			.addField(`\`💾\`Memory Usage`, `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB`)
			.addField(
				`\`📊\` General Stats`,
				stripIndents`
                        • Servers: ${this.client.guilds.cache.size.toLocaleString('en-US')}
                        • Channels: ${this.client.channels.cache.size.toLocaleString('en-US')}
                        • Users: ${this.client.guilds.cache
													.reduce((prev, val) => prev + val.memberCount, 0)
													.toLocaleString('en-US')}
			`,
			)
			.addField(
				'`👴` Reaction Role Stats',
				stripIndents`
				• Current: ${this.client.settings.reaction.filter(r => r.active).size.toLocaleString('en-US')}
				• Lifetime: ${this.client.settings.reaction.size.toLocaleString('en-US')}
			`,
			)
			.addField(
				'`📚` Library Info',
				stripIndents`
                    [\`Akairo Framework\`](https://discord-akairo.github.io/#/): ${akairoversion}
                    [\`Discord.js\`](https://discord.js.org/#/): ${djsversion}
        	`,
			)
			.addField('`👨‍` Lead Developer', (await this.client.fetchApplication()).owner!.toString())
			.setColor(this.client.config.color);
		return msg.util?.send({ embed });
	}
}