import Ember from 'ember';
const { keys } = Object;
const {A, run, typeOf, on} = Ember;
const defaultBindings = ['maxWidth', 'width', 'minWidth','height','minHeight','maxHeight','fontSize','fontFamily','fontWeight','fontStyle','cursor','display'];
const _unboundAttributes = ['style'];
const GOLDEN_RATIO = 1.618;
const ASPECT_RATIO = 1.3;
const sizer = size => {
  return Number(size) === size ? size + 'px' : size;
};
/**
 * Ensures that the value has been escaped before allowing through to the DOM
 * @param  {mixed}  input API or addon provided value
 * @return {string}       HTML escaped string
 */
const securitize = function(input){
  if(typeOf(input) === 'object') {
    input = input.toString();
  }
  return Ember.Handlebars.Utils.escapeExpression(input);
};

var SharedStylist = Ember.Mixin.create({
  _init: on('init', function() {
    // At component initialisation will add appropriate observers
    // based on "styleBindings" and "defaultBindings"
    const styleBindings = this.get('styleBindings');
    const observerBindings = styleBindings ? styleBindings : defaultBindings;
    observerBindings.map(item => {
      this.addObserver(item, this, '_setStyle');
    });
    // Components are by default bound to 'style', to break this unwanted binding we
    // must remove it from Ember's "attributeBindings" property before it is changed to
    // a ![concatinated property](http://emberjs.com/api/classes/Ember.CoreObject.html#property_concatenatedProperties)
    const attributeBindings = new A(this.get('attributeBindings'));
    _unboundAttributes.map(item => {
      if(attributeBindings.contains(item)) {
        attributeBindings.removeObject(item);
      }
    });
  }),
  // Because we created the observer dynamically we must take responsibility of
  // removing the observers on exit
  _willDestroyElement: on('willDestroyElement', function() {
    const styleBindings = this.get('styleBindings');
    const observerBindings = styleBindings ? styleBindings : defaultBindings;

    observerBindings.map(item => {
      this.removeObserver(item, this, '_setStyle');
    });
  }),
  /**
   * Aggregates all the properties specified in styleBindings into a single safe style string
   */
  _setStyle() {
    const componentStyleBindings = this.get('styleBindings');
    const styleProperties = componentStyleBindings ? componentStyleBindings : defaultBindings;
    /**
     * Provides a per-type styler that allows for some sensible defaults
     * @param  {string} style The style property being evaluated
     * @param  {string} value The suggested value for this style property
     * @return {string}       A mildly processed/improved variant on the input
     */
    const stylist = (style, value) => {
      switch(style) {
        case 'fontSize':
        case 'width':
        case 'minWidth':
        case 'maxWidth':
          return sizer(value);
        case 'height':
          let width = this.get('width');
          if(!width || String(width).substr(-2) !== 'px') {
            return sizer(value);
          }
          width = width.substr(0,width.length - 2);
          if(value === 'golden') {
             return width / GOLDEN_RATIO + 'px';
          } else if (value === 'square' && this.get('width')) {
            return width / ASPECT_RATIO + 'px';
          } else {
            return sizer(value);
          }
          return value;
        default:
          if(new A(['undefined','null']).contains(typeOf(value))) {
            return null;
          }
          return value;
      }
    };
    const execute = () => {
      let style = this.get('element.style');
      let whitelist = new A(this.get('_styleWhitelist'));
      if(style) {
        keys(styleProperties).map(item => {
          if(whitelist.contains(item)) {
            style[item] = securitize(stylist(item,styleProperties[item]));
          }
        });
      }
    };
    try {
      execute();
    } catch (e) {
      // prior to rendering there will be no 'style' property
      // to work off of so we must defer
      run.schedule('afterRender', function() {
        execute();
      });
    }
  },
});

SharedStylist[Ember.NAME_KEY] = 'Shared Stylist';
export default SharedStylist;
