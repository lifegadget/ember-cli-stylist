import Ember from 'ember';
import SharedStylist from 'ember-cli-stylist/mixins/shared-stylist';
export default Ember.Component.extend(SharedStylist,{
  attributeBindings: ['stylist:style'],
  styleBindings: [ 'width', 'height', 'fontSize', 'fontColor' ],
  width: null,
  height: null,
  fontFamily: null,
  _fontFamily: Ember.computed('fontFamily', function() {
    return this.get('fontFamily') ? this.get('fontFamily') : 'monospace';
  })
});
