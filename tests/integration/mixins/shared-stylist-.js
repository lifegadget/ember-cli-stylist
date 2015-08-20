import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';


moduleForComponent('shared-stylist', 'Integration | Mixin | shared-stylist', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(1);

  this.render(hbs`
    {{test-component}}
  `);

  assert.equal(this.$().text().trim(), 'test');
});

test('setting width', function(assert) {
  assert.expect(1);
  this.render(hbs`
    {{test-component width='50px'}}
  `);

  assert.equal(this.$().attr('style'), 'width: 50px');
});
