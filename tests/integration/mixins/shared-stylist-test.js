import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';
const { keys, create } = Object; // jshint ignore:line
const { RSVP: {Promise, all, race, resolve, defer} } = Ember; // jshint ignore:line
const { inject: {service} } = Ember; // jshint ignore:line
const { computed, observer, $, run, on, typeOf, isPresent } = Ember;  // jshint ignore:line
const { defineProperty, get, set, inject, isEmpty, merge } = Ember; // jshint ignore:line
const a = Ember.A; // jshint ignore:line



moduleForComponent('test-component', 'Integration | Mixin | shared-stylist', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(2);

  this.render(hbs`
    {{test-component title='test'}}
  `);

  assert.equal(this.$().text().trim(), 'test');
  assert.equal(this.$('.inner').length, 1, 'found inner class');
});

test('setting width', function(assert) {
  assert.expect(4);
  this.render(hbs`
    {{test-component width='50px' styleBindings='width'}}
  `);

  assert.equal(this.$('.ember-view[style*="width"]').length, 1, 'outer class has width');
  assert.equal(this.$('.ember-view')[0].style.width, '50px', 'outer class width at right value');
  assert.equal(this.$('.inner[style*="width"]').length, 1, 'inner class has width');
  assert.equal(this.$('.inner')[0].style.width, '50px', 'inner class width at right value');
});

test('setting backgound-color', function(assert) {
  assert.expect(4);
  this.render(hbs`
    {{test-component backgroundColor='red' styleBindings='backgroundColor'}}
  `);

  assert.equal(this.$('.ember-view[style*="background-color"]').length, 1, 'outer class has background-color');
  assert.equal(this.$('.ember-view')[0].style['background-color'], 'red', 'outer class has correct value');
  assert.equal(this.$('.inner[style*="background-color"]').length, 1, 'inner class has background-color');
  assert.equal(this.$('.inner')[0].style['background-color'], 'red', 'inner class has correct value');
});

test('setting scalar value translated to rem value', function(assert) {
  assert.expect(2);
  this.render(hbs`
    {{test-component fontSize='10x' styleBindings='fontSize'}}
  `);

  assert.equal(this.$('.ember-view[style*="font-size"]').length, 1, 'detected style binding');
  assert.equal(this.$('.ember-view')[0].style['font-size'], '10rem', 'style is correctly set ');
});

test('aliased style works', function(assert) {
  assert.expect(3);
  this.set('family', null);
  this.render(hbs`
    {{test-component fontFamily=family styleBindings='fontFamily::_fontFamily'}}
  `);

  assert.equal(this.$('.ember-view[style*="font-family"]').length, 1, 'detected style binding');
  assert.equal(this.$('.ember-view')[0].style['font-family'], 'monospace', 'style is correctly set on initialisation.');

  this.set('family', 'serif');
  assert.equal(this.$('.ember-view')[0].style['font-family'], 'serif', 'aliased style -- a CP -- has detected underlying change and changed value.');
});
