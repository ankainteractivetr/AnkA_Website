import assert from 'node:assert/strict';
import { test } from 'node:test';
import { WhatsAppLink } from './WhatsAppLink.js';

test('a click-to-chat address with the message URL-encoded', () => {
  const link = new WhatsAppLink('905001112233', 'Merhaba, işletmemin adı: ');
  assert.equal(String(link), 'https://wa.me/905001112233?text=Merhaba%2C%20i%C5%9Fletmemin%20ad%C4%B1%3A%20');
});
