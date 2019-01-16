import { Meteor } from 'meteor/meteor';
import { Inject } from 'meteor/meteorhacks:inject-initial';

Inject.rawBody('icons', Assets.getText('public/icons.svg'));
