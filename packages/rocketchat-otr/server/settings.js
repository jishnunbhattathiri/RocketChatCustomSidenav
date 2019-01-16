import { RocketChat } from 'meteor/rocketchat:lib';

RocketChat.settings.addGroup('OTR', function() {
	this.add('OTR_Enable', true, {
		type: 'boolean',
		i18nLabel: 'Enabled',
		public: true,
	});
});
