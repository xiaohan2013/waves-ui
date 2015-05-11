const BaseBehavior = require('./base-behavior');

class SegmentBehavior extends BaseBehavior {
  // constructor() {}

  edit(context, shape, datum, dx, dy, target) {
    let action = 'move';
    const classList = target.classList;

    if (classList.contains('handler') && classList.contains('left')) {
      action = 'resizeLeft';
    } else if (classList.contains('handler') && classList.contains('right')) {
      action = 'resizeRight';
    }

    this[`_${action}`](context, shape, datum, dx, dy, target);
  }

  _move(context, shape, datum, dx, dy, target) {
    const layerHeight = context.params.height;
    // current values
    const x = context.xScale(shape.x(datum));
    const y = context.yScale(shape.y(datum));
    const height = context.yScale(shape.height(datum));
    // target values
    let targetX = Math.max(x + dx, 0);
    let targetY = y - dy;

    // lock in layer's y axis
    if (targetY < 0) {
      targetY = 0;
    } else if (targetY + height > layerHeight) {
      targetY = layerHeight - height
    }

    shape.x(datum, context.xScale.invert(targetX));
    shape.y(datum, context.yScale.invert(targetY));
  }

  _resizeLeft(context, shape, datum, dx, dy, target) {
    // current values
    const x     = context.xScale(shape.x(datum));
    const width = context.xScale(shape.width(datum));
    // target values
    let maxTargetX  = x + width;
    let targetX     = x + dx < maxTargetX ? Math.max(x + dx, 0) : x;
    let targetWidth = targetX !== 0 ? Math.max(width - dx, 1) : width;

    shape.x(datum, context.xScale.invert(targetX));
    shape.width(datum, context.xScale.invert(targetWidth));
  }

  _resizeRight(context, shape, datum, dx, dy, target) {
    // current values
    const width = context.xScale(shape.width(datum));
    // target values
    let targetWidth = Math.max(width + dx, 1);

    shape.width(datum, context.xScale.invert(targetWidth));
  }
}

module.exports = SegmentBehavior;