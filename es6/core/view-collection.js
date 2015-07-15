/**
 *
 */
export default class ViewCollection extends Array {
  constructor(timeline) {
    super();

    this._timeline = timeline;
  }

  set offset(value) {
    this.forEach((view) => view.offset = value);
  }

  set zoom(value) {
    this.forEach((view) => view.zoom = value);
  }

  set width(value) {
    this.forEach((view) => view.width = value);
  }

  set pixelsPerSecond(value) {
    this.forEach((view) => view.pixelsPerSecond = value);
  }

  set maintainVisibleDuration(value) {
    this.forEach((view) => view.maintainVisibleDuration = value);
  }

  render() {
    this.forEach((view) => view.render());
    this._timeline.emit('render');
  }

  update() {
    this.forEach((view) => view.update());
    this._timeline.emit('update');
  }

  updateContainer() {
    this.forEach((view) => view.updateContainer());
    this._timeline.emit('update:containers');
  }

  updateLayers() {
    this.forEach((view) => view.updateLayers());
    this._timeline.emit('update:layers');
  }
}