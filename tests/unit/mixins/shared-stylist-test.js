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
    // Renders the component to the page
    this.render();
    assert.equal(component._state, 'inDOM');
  });
});

test('only bound style properties set on initialisation', function(assert) {
  assert.expect(3);
  Ember.run(()=> {
    var component = this.subject({
      styleBindings: ['width', 'height'],
      width: '500px',
      height: '350px',
      fontColor: 'red', // should be ignored
    });
    this.render();
    Ember.run.next(() => {
      assert.equal(component.get('element.style.width'), '500px', 'width set');
      assert.equal(component.get('element.style.height'), '350px', 'height set');
      assert.equal(Boolean(component.get('element.style.fontColor')), false);
    });
  });
});

test('with fontColor a styleBinding it is set', function(assert) {
  assert.expect(3);
  Ember.run(()=> {
    var component = this.subject({
      styleBindings: ['width', 'height', 'fontColor'],
      width: '500px',
      height: '350px',
      fontColor: 'red', // should NOT be ignored
    });
    this.render();
    Ember.run.next(() => {
      assert.equal(component.get('element.style.width'), '500px', 'width set');
      assert.equal(component.get('element.style.height'), '350px', 'height set');
      assert.equal(component.get('element.style.fontColor'), 'red');
    });
  });
});

test('observer detects change to styleBound properties', function(assert) {
  assert.expect(4);
  Ember.run(()=> {
    var component = this.subject({
      styleBindings: ['width', 'height', 'fontColor'],
      width: '500px',
      height: '350px'
    });
    this.render();
    Ember.run.next(() => {
      assert.equal(component.get('element.style.width'), '500px', 'width set');
      assert.equal(component.get('element.style.height'), '350px', 'height set');
    });
    Ember.run.next(() => {
      component.set('width', '600px');
      component.set('height', '120px');
      assert.equal(component.get('element.style.width'), '600px', 'width now set to 600px');
      assert.equal(component.get('element.style.height'), '120px', 'height now set to 120px');
    });

  });
});


// test('lack of units for "sizer" units is resolved to pixels', function(assert) {
//   assert.expect(2);
//   Ember.run(()=> {
//     var component = this.subject({
//       styleBindings: ['width', 'height'],
//       width: '500',
//       height: '350'
//     });
//     this.render();
//     Ember.run.next(() => {
//       assert.equal(component.get('element.style.width'), '500px', 'width set');
//       assert.equal(component.get('element.style.height'), '350px', 'height set');
//     });

//   });
// });
