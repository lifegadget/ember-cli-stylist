import Ember from 'ember';
import SharedStylist from 'ember-cli-stylist/mixins/shared-stylist';
export default Ember.Component.extend(SharedStylist,{
  styleBindings: ['width', 'height', 'fontSize']
});
