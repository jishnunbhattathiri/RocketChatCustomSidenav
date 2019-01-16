import { t, getUserPreference, handleError } from 'meteor/rocketchat:utils';
import { AccountBox, menu, SideNav } from 'meteor/rocketchat:ui-utils';
import { hasAtLeastOnePermission } from 'meteor/rocketchat:authorization';
import { popover } from 'meteor/rocketchat:ui-utils';
const viewModeIcon = {
	extended: 'th-list',
	medium: 'list',
	condensed: 'list-alt'
};
const toolbarButtons = user => [
	{
		name: t('Search'),
		icon: 'magnifier',
		action: () => {
			toolbarSearch.show(false);
		}
	},
	{
		name: t('Directory'),
		icon: 'globe',
		action: () => {
			menu.close();
			FlowRouter.go('directory');
		}
	},
	{
		name: t('View_mode'),
		icon: () =>
			viewModeIcon[getUserPreference(user, 'sidebarViewMode') || 'condensed'],
		action: e => {
			const hideAvatarSetting = getUserPreference(user, 'sidebarHideAvatar');
			const config = {
				columns: [
					{
						groups: [
							{
								items: [
									extendedViewOption(user),
									{
										icon: viewModeIcon.medium,
										name: t('Medium'),
										modifier:
											getUserPreference(user, 'sidebarViewMode') === 'medium'
												? 'bold'
												: null,
										action: () => {
											Meteor.call(
												'saveUserPreferences',
												{ sidebarViewMode: 'medium' },
												function(error) {
													if (error) {
														return handleError(error);
													}
												}
											);
										}
									},
									{
										icon: viewModeIcon.condensed,
										name: t('Condensed'),
										modifier:
											getUserPreference(user, 'sidebarViewMode') === 'condensed'
												? 'bold'
												: null,
										action: () => {
											Meteor.call(
												'saveUserPreferences',
												{ sidebarViewMode: 'condensed' },
												function(error) {
													if (error) {
														return handleError(error);
													}
												}
											);
										}
									}
								]
							},
							{
								items: [
									{
										icon: 'user-rounded',
										name: hideAvatarSetting
											? t('Show_Avatars')
											: t('Hide_Avatars'),
										action: () => {
											Meteor.call(
												'saveUserPreferences',
												{ sidebarHideAvatar: !hideAvatarSetting },
												function(error) {
													if (error) {
														return handleError(error);
													}
												}
											);
										}
									}
								]
							}
						]
					}
				],
				currentTarget: e.currentTarget,
				offsetVertical: e.currentTarget.clientHeight + 10
			};

			popover.open(config);
		}
	},
	{
		name: t('Sort'),
		icon: 'sort',
		action: e => {
			const options = [];
			const config = {
				template: 'sortlist',
				currentTarget: e.currentTarget,
				data: {
					options
				},
				offsetVertical: e.currentTarget.clientHeight + 10
			};
			popover.open(config);
		}
	},
	{
		name: t('Moods'),
		icon: 'emoji',
		action: e => {
			let moodeOptions;
			if (
				hasAtLeastOnePermission([
					'manage-emoji',
					'manage-integrations',
					'manage-oauth-apps',
					'manage-own-integrations',
					'manage-sounds',
					'view-logs',
					'view-privileged-setting',
					'view-room-administration',
					'view-statistics',
					'view-user-administration'
				])
			) {
				moodOptions = [
					{
						icon: 'emoji',
						name: t('Happy'),
						type: 'open',
						id: 'happy',
						action: () => {}
					},
					{
						icon: 'emojisad',
						name: t('Sad'),
						type: 'open',
						id: 'happy',
						action: () => {}
					},
					{
						icon: 'emojiuncertain',
						name: t('Uncertain'),
						type: 'open',
						id: 'happy',
						action: () => {}
					},
					{
						icon: 'emojiconfused',
						name: t('Confused'),
						type: 'open',
						id: 'happy',
						action: () => {}
					}
				];
			}

			const config = {
				popoverClass: 'sidebar-header',
				columns: [
					{
						groups: [
							{
								items: AccountBox.getItems()
									.map(item => {
										let action;

										if (item.href) {
											action = () => {
												FlowRouter.go(item.href);
												popover.close();
											};
										}

										if (item.sideNav) {
											action = () => {
												SideNav.setFlex(item.sideNav);
												SideNav.openFlex();
												popover.close();
											};
										}

										return {
											icon: item.icon,
											name: t(item.name),
											type: 'open',
											id: item.name,
											href: item.href,
											sideNav: item.sideNav,
											action
										};
									})
									.concat(moodOptions)
							},
							{
								items: [
									{
										icon: 'user-rounded',
										name: t('Mood Chart'),
										content: true,
										action: () => {
											Meteor.call(
												'saveUserPreferences',
												{ sidebarHideAvatar: !hideAvatarSetting },
												function(error) {
													if (error) {
														return handleError(error);
													}
												}
											);
										}
									}
								]
							}
						]
					}
				],
				currentTarget: e.currentTarget,
				offsetVertical: e.currentTarget.clientHeight + 10
			};

			popover.open(config);
		}
	},
	{
		name: t('Create_A_New_Channel'),
		icon: 'edit-rounded',
		condition: () => hasAtLeastOnePermission(['create-c', 'create-p']),
		action: () => {
			menu.close();
			FlowRouter.go('create-channel');
		}
	},
	{
		name: t('Options'),
		icon: 'menu',
		condition: () =>
			AccountBox.getItems().length ||
			hasAtLeastOnePermission([
				'manage-emoji',
				'manage-integrations',
				'manage-oauth-apps',
				'manage-own-integrations',
				'manage-sounds',
				'view-logs',
				'view-privileged-setting',
				'view-room-administration',
				'view-statistics',
				'view-user-administration'
			]),
		action: e => {
			let adminOption;
			if (
				hasAtLeastOnePermission([
					'manage-emoji',
					'manage-integrations',
					'manage-oauth-apps',
					'manage-own-integrations',
					'manage-sounds',
					'view-logs',
					'view-privileged-setting',
					'view-room-administration',
					'view-statistics',
					'view-user-administration'
				])
			) {
				adminOption = {
					icon: 'customize',
					name: t('Administration'),
					type: 'open',
					id: 'administration',
					action: () => {
						SideNav.setFlex('adminFlex');
						SideNav.openFlex();
						FlowRouter.go('admin-info');
						popover.close();
					}
				};
			}

			const config = {
				popoverClass: 'sidebar-header',
				columns: [
					{
						groups: [
							{
								items: AccountBox.getItems()
									.map(item => {
										let action;

										if (item.href) {
											action = () => {
												FlowRouter.go(item.href);
												popover.close();
											};
										}

										if (item.sideNav) {
											action = () => {
												SideNav.setFlex(item.sideNav);
												SideNav.openFlex();
												popover.close();
											};
										}

										return {
											icon: item.icon,
											name: t(item.name),
											type: 'open',
											id: item.name,
											href: item.href,
											sideNav: item.sideNav,
											action
										};
									})
									.concat([adminOption])
							}
						]
					}
				],
				currentTarget: e.currentTarget,
				offsetVertical: e.currentTarget.clientHeight + 10
			};

			popover.open(config);
		}
	}
];
Template.sidebarHeader.helpers({
	toolbarButtons() {
		return toolbarButtons(Meteor.userId()).filter(
			button => !button.condition || button.condition()
		);
	}
});
