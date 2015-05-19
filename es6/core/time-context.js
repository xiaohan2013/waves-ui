const d3 = require('d3');
const ns = require('./namespace');

class TimeContext {
  constructor(parent = null) {
    this._parent = parent;
    this._children = [];

    this._xScale = null; // inherits from parent context
    this._originalXScale = null;

    this.start = 0;
    this.duration = 1;
    this.offset = 0;
    this._stretchRatio = 1;
    // @NOTE: need an `absoluteStretchRatio` ?

    if (parent) {
      parent._children.push(this);
    }
  }

  /**
   * @return {Function} the closest available xScale in the tree
   */
  get xScale() {
    if (this._parent && !this._xScale) {
      return this._parent.xScale;
    } else {
      return this._xScale;
    }
  }

  set xScale(xScale) {
    this._xScale = xScale;
  }

  // read only
  get originalXScale() {
    // lazy bind originalXScale on top of the tree
    if (!this._parent && !this._originalXScale) {
      this._originalXScale = this._xScale;
    }

    // returns the closest available xScale in the tree
    if (this._parent) {
      return this._parent.originalXScale;
    } else {
      return this._originalXScale;
    }
  }

  get stretchRatio() {
    return this._stretchRatio;
  }

  // @FIXME: inconsistencies occur when on child context stretch
  // when stretching parent (=> when child.stretchRatio != 1)
  set stretchRatio(ratio) {
    // do not remove xScale on top of the graph
    if (
      ratio === 1 &&
      this._parent &&
      this._parent.stretchRatio === 1
    ) {
      this._xScale = null;
    } else {
      const xScale = this.originalXScale.copy();
      const [min, max] = xScale.domain();
      const diff = (max - min) / ratio;
      xScale.domain([min, min + diff]);

      this._xScale = xScale;
    }

    const ratioChange = ratio / this._stretchRatio;
    this._stretchRatio = ratio;

    // propagate change to children who have their own stretchRatio
    this._children.forEach(function(child) {
      if (child._xScale) {
        child.stretchRatio = child.stretchRatio * ratioChange;
      }
    });
  }
}

module.exports = TimeContext;