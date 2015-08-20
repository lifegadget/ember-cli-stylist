import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';
const {get, set} = Ember;  // jshint ignore:line



moduleForComponent('test-component', 'Integration | Mixin | shared-stylist', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(1);

  this.render(hbs`
    {{test-component}}
  `);

  assert.equal(this.$().text().trim(), 'test');
});

// test('setting width', function(assert) {
//   assert.expect(1);
//   this.render(hbs`
//     {{test-component width='50px'}}
//   `);

//   assert.equal(this.get('element.style.width'), 'width: 50px');
// });
