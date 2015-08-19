import Ember from 'ember';
import SharedStylist from 'ember-cli-stylist/mixins/shared-stylist';

export default Ember.Component.extend(SharedStylist, {
  width: 6,

  backColor: "red",

  classNames: ['test-component'],
  
  style: Ember.computed('width', 'backColor', function() {
  	if (this.get('backColor') === 'red')
  	{
	    return {
	      width: this.get('width')+'px',
	      backgroundColor: this.get('backColor')
	    };
	  }
	  else
  	{
  		// test removing a style that was there last time
	    return {
	      width: this.get('width')+'px'
	    };
	  }
  }),

  click: function() {
  	this.set('width', 20);
  	this.set('backColor', 'green');
  }
});
