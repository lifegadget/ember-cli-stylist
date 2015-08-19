import Ember from 'ember';

export default Ember.Mixin.create({

  /* component should expose a style property which should be an object e.g.
  style: Ember.computed('myWidth', function() {
    return {
      width: this.get('myWidth'),
      minHeight: 100,
      color: htmlSafe("red")
    }
  })
  If SafeString is not used then the values will be escaped.
  */
  _lastKeys: [],

  _styleInit: Ember.on('willInsertElement', function() {
    this._setStyle(); 
  }),

  _styleObserver: Ember.observer('style', function() {
    this._setStyle(); 
  }),

  _setStyle: function() {
    var style = this.get('style');

    var domStyle = this.get('element').style;

    var newKeys = [];
    var removedKeys = this._lastKeys;

    for (var key in style) {
      if (style.hasOwnProperty(key)) {
        var value = style[key];

        // clean up the key and value
        key = Ember.String.dasherize(key);
        value = this._escape(value);

        // set the dom style
        domStyle.setProperty(key, value);

        // deal with keys that have been removed since last time
        newKeys.push(key);
        var index = removedKeys.indexOf(key);
        if (index >= 0)
        {
          removedKeys.splice( index, 1 );
        }
      }
    }
    // remove old styles that we don't need any more
    for (var removedIndex in removedKeys) {
      domStyle.removeProperty(removedKeys[removedIndex]);
    }
    this._lastKeys = newKeys;
  },

  _escape: function(data) {
    if (data instanceof Ember.Handlebars.SafeString)
    {
      // safe string, so return unmodified
      return data;
    }
    var type = typeof data;
    if (type === "number" || 
        type === "boolean")
    {
      // those are all safe
      return data.toString();
    }
    if (type === "object")
    {
      data = data.toString();
    }
    return Ember.Handlebars.Utils.escapeExpression(data);
  }
});
