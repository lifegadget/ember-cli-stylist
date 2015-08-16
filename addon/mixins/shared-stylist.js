import Ember from 'ember';
const { keys } = Object;
const {observer, A, run, typeOf, on} = Ember;
const _styleProperties = ['maxWidth', 'width', 'minWidth','height','fontSize','fontFamily','fontWeight','fontStyle','cursor'];
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
  _styleWhitelist: _styleProperties,
  _unbindStyle: on('didInitAttrs',function() {
    new A(this.get('attributeBindings')).removeObject('style');
  }),
  _style: on('init',observer(..._styleProperties, function() {
    this._setStyle();
  })),
  _setStyle() {
    const styleProperties = this.getProperties(..._styleProperties);
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
    run.schedule('afterRender', this, function(){
      let style = this.get('element').style;
      let whitelist = new A(this.get('_styleWhitelist'));
      keys(styleProperties).map(item => {
        if(whitelist.contains(item)) {
          style[item] = securitize(stylist(item,styleProperties[item]));
        }
      });
    });
  },
});

SharedStylist[Ember.NAME_KEY] = 'Shared Stylist';
export default SharedStylist;
