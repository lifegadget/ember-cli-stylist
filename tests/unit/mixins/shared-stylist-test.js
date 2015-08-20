import Ember from 'ember';
const { computed, observer, $, A, run, on, typeOf, defineProperty, get } = Ember;    // jshint ignore:line

import SharedStylist from 'ember-cli-stylist/mixins/shared-stylist';
import { module, test } from 'qunit';

module('Unit | Mixin | shared-stylist', {
  unit: true
});

// Replace this with your real tests.
test('it works', function(assert) {
  var obj = Ember.Object.extend(SharedStylist);
  var subject = obj.create();
  assert.ok(subject);
});

test('only bound style properties set on initialisation', function(assert) {
  assert.expect(3);
  Ember.run(()=> {
    let Testy = Ember.Object.extend(SharedStylist, {
      styleBindings: ['width', 'height'],
      width: '500px',
      height: '350px',
      fontColor: 'red', // should be ignored
    });
    let subject = Testy.create();
    Ember.run.schedule('afterRender', () => {
      assert.equal(subject.$('element').style.width, '500px');
      assert.equal(subject.$('element').style.height, '350px');
      assert.equal(Boolean(subject.style.fontColor), false);
    });
  });
});
