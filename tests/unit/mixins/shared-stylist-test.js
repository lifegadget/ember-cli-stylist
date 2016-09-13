import Ember from 'ember';
const { computed, observer, $, A, run, on, typeOf, defineProperty, get } = Ember;    // jshint ignore:line
import {
  moduleForComponent,
  test
} from 'ember-qunit';

moduleForComponent('test-component', 'Unit | Mixin | shared-stylist', {
  // Specify the other units that are required for this test
  // needs: ['mixin:shared-stylist'],
  unit: true
});

// Replace this with your real tests.
test('it works', function(assert) {
  run.next(()=>{
    var component = this.subject();
    assert.equal(component._state, 'preRender');
    this.render();
    assert.equal(component._state, 'inDOM');
  });
});

test('only bound style properties set on initialisation', function(assert) {
  assert.expect(3);
  Ember.run(()=> {
    var component = this.subject({
      classNames: ['my-test'],
      styleBindings: ['width', 'height'],
      width: '500px',
      height: '350px',
      fontColor: 'red', // should be ignored
    });
    this.render();
    Ember.run.next(() => {
      assert.equal(component.$()[0].style.width, '500px', 'width set');
      assert.equal(component.$()[0].style.height, '350px', 'height set');
      assert.equal(component.$()[0].style.fontColor, undefined);
    });
  });
});

test('with fontColor a styleBinding it is set', function(assert) {
  assert.expect(4);
  Ember.run(()=> {
    var component = this.subject({
      styleBindings: ['width', 'height', 'backgroundColor'],
      width: '500px',
      height: '350px',
      backgroundColor: 'red', // should NOT be ignored
    });
    this.render();
    Ember.run.next(() => {
      assert.notEqual(component.stylist.string.indexOf('background-color'), -1);
      assert.equal(component.$()[0].style.width, '500px', 'width set');
      assert.equal(component.$()[0].style.height, '350px', 'height set');
      assert.equal(component.$()[0].style['background-color'], 'red');
    });
  });
});

test('numeric units for "sizer" uoms is resolved to pixels', function(assert) {
  assert.expect(2);
  Ember.run(()=> {
    var component = this.subject({
      styleBindings: ['width', 'height'],
      width: 500,
      height: '350'
    });
    this.render();
    Ember.run.next(() => {
      assert.equal(component.$()[0].style.width, '500px', 'width set');
      assert.equal(component.$()[0].style.height, '350px', 'height set');
    });

  });
});

test('test setting a "sizer" uom with a percentage', function(assert) {
  assert.expect(1);
  Ember.run(()=> {
    var component = this.subject({
      styleBindings: ['width', 'height'],
      width: '100%'
    });
    this.render();
    Ember.run.next(() => {
      assert.equal(component.$()[0].style.width, '100%', 'width set to 100%');
    });

  });
});

test('test that default bindings work', function(assert) {
  assert.expect(2);
  Ember.run(()=> {
    var component = this.subject({
      width: '100%',
      height: '4em'
    });
    this.render();
    Ember.run.next(() => {
      assert.equal(component.$()[0].style.width, '100%', 'width set');
      assert.equal(component.$()[0].style.height, '4em', 'height set');
    });

  });
});
