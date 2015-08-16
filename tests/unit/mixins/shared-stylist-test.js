import Ember from 'ember';
import SharedStylistMixin from '../../../mixins/shared-stylist';
import { module, test } from 'qunit';

module('Unit | Mixin | shared stylist');

// Replace this with your real tests.
test('it works', function(assert) {
  var SharedStylistObject = Ember.Object.extend(SharedStylistMixin);
  var subject = SharedStylistObject.create();
  assert.ok(subject);
});
