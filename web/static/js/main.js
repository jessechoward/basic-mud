import {WebsockClient} from './modules/WebsockClient.js';

$('document').ready(() =>
{
	new WebsockClient('ws://localhost:4000/', 'something');
});
