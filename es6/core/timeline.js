const events = require('events');
const ns = require('./namespace');
const TimeContext = require('./time-context');
const Surface  = require('../interactions/surface');
const Keyboard = require('../interactions/keyboard');
const Layer = require('./layer');
const d3Scale = require('d3-scale');

/**
 *  @class Timeline
 */
class Timeline extends events.EventEmitter {
  /**
   *  Creates a new Timeline
   *  @param params {Object} an object to override defaults parameters
   */
  constructor(params = {}) {
    super();

    this._defaults = {
      width: 1000,
      duration: 60
    };

    // public attributes
    this.params = Object.assign({}, this._defaults, params);
    this.layers = [];
    this.categorizedLayers = {}; // group layer by categories
    // @TODO rename to timeContext
    this.timeContext = null;
    // private attributes
    this._state = null;
    this.containers = {};
    this._layerContainerMap = new Map();
    this._handleEvent = this._handleEvent.bind(this);

    this._createTimeContext();
    this._createInteraction(Keyboard, 'body');
  }

  /**
   *  Change the state of the timeline, `States` are the main entry point between
   *  application logic, interactions, ..., and the library
   *  @param state {BaseState} the state in which the timeline must be setted
   */
  setState(state) {
    if (this._state) { this._state.exit(); }
    this._state = state;
    this._state.enter();
  }

  /**
   *  @private
   *  The callback that is used to listen to interactions modules
   *  @params e {Event} a custom event generated by interaction modules
   */
  _handleEvent(e) {
    if (!this._state) { return; }
    this._state.handleEvent(e);
  }

  /**
   *  Factory method to add interaction modules the timeline should listen to
   *  by default, the timeline listen to Keyboard, and instance a Surface on each
   *  container
   *  @param ctor {EventSource} the contructor of the interaction module to instanciate
   *  @param el {DOMElement} the DOM element to bind to the EventSource module
   */
  _createInteraction(ctor, el, options = {}) {
    const interaction = new ctor(el, options);
    interaction.on('event', this._handleEvent);
  }

  /**
   *  Creates a new TimeContext for the visualisation, this `TimeContext`
   *  will be at the top of the `TimeContext` tree
   */
  _createTimeContext() {
    const duration = this.params.duration;
    const width = this.params.width;

    const xScale = d3Scale.linear()
      .domain([0, duration])
      .range([0, width]);

    this.timeContext = new TimeContext();
    this.timeContext.duration =  duration;
    this.timeContext.xScale = xScale;
  }

  // get xScale() {
  //   return this.timeContext.xScale;
  // }

  // @TODO rename to addLayer
  /**
   *  Adds a `Layer` to the Timeline
   *  @param layer {Layer} the layer to register
   *  @param containerId {String} a valid id of a previsouly registered container
   *  @param category {String} insert the layer into some user defined category
   *  @param timeContext {TimeContext} a `TimeContext` the layer is associated with
   *      if null given, a new `TimeContext` will be created for the layer
   */
  addLayer(layer, containerId, category = 'default') {
    this._layerContainerMap.set(layer, this.containers[containerId]);
    this.layers.push(layer);

    if (!this.categorizedLayers[category]) {
      this.categorizedLayers[category] = [];
    }

    this.categorizedLayers[category].push(layer);
  }

  /**
   *  Remove a layer from the timeline
   *  @param layer {Layer} the layer to remove
   */
  removeLayer(layer) {

  }

  /**
   *  Returns an array of layers given some category
   *  @param category {String} name of the category
   *  @return {Array} an array of layers which belongs to the category
   */
  getLayers(category = 'default') {
    return this.categorizedLayers[category] || [];
  }

  /**
   *  Register a container and prepare the DOM svg element for the timeline's layers
   *  @param id {String} a user defined id for the container
   *  @param el {DOMElement} the DOMElement to use as a container
   *  @param options {Object} the options to apply to the container
   */
  registerContainer(id, el, options = {}) {
    const width = this.params.width;
    const height = options.height || 120;

    const svg = document.createElementNS(ns, 'svg');
    svg.setAttributeNS(null, 'width', width);
    svg.setAttributeNS(null, 'height', height);
    svg.setAttributeNS(null, 'viewbox', `0 0 ${width} ${height}`);

    svg.setAttributeNS(null, 'shape-rendering', 'optimizeSpeed');

    // svg.setAttributeNS(ns, 'xmlns', ns);
    svg.setAttribute('xmlns:xhtml', 'http://www.w3.org/1999/xhtml');

    const defs = document.createElementNS(ns, 'defs');

    const offsetGroup = document.createElementNS(ns, 'g');
    offsetGroup.classList.add('offset');

    const layoutGroup = document.createElementNS(ns, 'g');
    layoutGroup.classList.add('layout');

    const interactionsGroup = document.createElementNS(ns, 'g');
    interactionsGroup.classList.add('interactions');

    svg.appendChild(defs);
    offsetGroup.appendChild(layoutGroup);
    svg.appendChild(offsetGroup);
    svg.appendChild(interactionsGroup);

    el.appendChild(svg);
    // remove additionnal height created who knows why...
    el.style.fontSize = 0;
    el.style.transform = 'translateZ(0)'; // this fixes weird canvas rendering bugs in chrome
    // el.style.position = 'relative';

    // svg.style.position = 'absolute';
    // svg.style.top = 0;
    // svg.style.left = 0;

    // create a container object
    const container = {
      id: id,
      layoutElement: layoutGroup,
      offsetElement: offsetGroup,
      interactionsElement: interactionsGroup,
      svgElement: svg,
      DOMElement: el,
      brushElement: null
    };

    this.containers[id] = container;
    this._createInteraction(Surface, el);
  }

  // container helpers
  // @NOTE change to `getContainer(el || id || layer)` ?
  getContainerPerElement(el) {
    for (let id in this.containers) {
      const container = this.containers[id];
      if (container.DOMElement === el) { return container; }
    }

    return null;
  }

  getLayerContainer(layer) {
    return this._layerContainerMap.get(layer);
  }

  // getContainerPerId(id) {
  //   return this.containers[id];
  // }



  /**
   *  Render all the layers in the timeline
   */
  render() {
    this.layers.forEach((layer) => {
      const container = this._layerContainerMap.get(layer);
      const layout = container.layoutElement;
      layout.appendChild(layer.render());
    });
  }

  /**
   *  Draw all the layers in the timeline
   */
  draw(layerOrCategory = null) {
    let layers = null;

    if (typeof layerOrCategory === 'string') {
      layers = this.getLayers(layerOrCategory);
    } else if (layerOrCategory instanceof Layer) {
      layers = [layerOrCategory];
    } else {
      layers = this.layers;
    }

    this.layers.forEach((layer) => layer.draw());
  }

  // @TODO rename to updateContext
  updateContainers() {
    for (let id in this.containers) {
      const container = this.containers[id];
      const offset = container.offsetElement;
      const timeContext = this.timeContext;
      const translate = `translate(${timeContext.xScale(timeContext.offset)}, 0)`;
      offset.setAttributeNS(null, 'transform', translate);
    }
  }
  /**
   *  Update all the layers in the timeline
   *  @TODO accept several `layers` or `categories` as arguments ?
   */
  update(layerOrCategory = null) {
    this.updateContainers();
    let layers = null;

    if (typeof layerOrCategory === 'string') {
      layers = this.getLayers(layerOrCategory);
    } else if (layerOrCategory instanceof Layer) {
      layers = [layerOrCategory];
    } else {
      layers = this.layers;
    }

    this.emit('update', layers);
    layers.forEach((layer) => layer.update());
  }

  updateContexts() {
    this.layers.forEach((layer) => layer.updateContext());
  }
}

module.exports = Timeline;
