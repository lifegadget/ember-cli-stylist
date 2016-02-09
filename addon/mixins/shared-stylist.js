import Ember from 'ember';
const {A, run, typeOf, on} = Ember;
const defaultBindings = ['maxWidth', 'width', 'minWidth','height','minHeight','maxHeight','fontSize','fontFamily','fontWeight','fontStyle','cursor','display'];
const sizer = size => {
  return Number(size) === size ? size + 'px' : size;
};


const htmlSafe = Ember.String.htmlSafe;

var SharedStylist = Ember.Mixin.create({
  _initialise: on('init', function() {
    // At component initialisation will add appropriate observers
    // based on "styleBindings" and "defaultBindings"
    const styleBindings = this.get('styleBindings');
    const observerBindings = styleBindings ? styleBindings : defaultBindings;
    observerBindings.map(item => {
      this.addObserver(item, this._setStyle);
    });
    run.schedule('afterRender', () => {
      this._setStyle();
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
          return sizer(value);
        default:
          if(new A(['undefined','null']).contains(typeOf(value))) {
            return null;
          }
          return value;
      }
    };
    let style = [];
    const values = this.getProperties(...styleProperties);
    if(style) {
      styleProperties.map(item => {
        if(values[item]) {
          style.push(`${item}: ${stylist(item,values[item])}`);
        }
      });
    }
    this.set('style', htmlSafe(style.join('; ')));
  },
});

SharedStylist[Ember.NAME_KEY] = 'Shared Stylist';
export default SharedStylist;
