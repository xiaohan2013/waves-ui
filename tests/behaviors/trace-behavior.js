const assert = require('assert');

const Layer = require('../../es6/core/layer');
const LayerTimeContext = require('../../es6/core/layer-time-context');
const TraceDots = require('../../es6/shapes/trace-dots');
const TraceBehavior = require('../../es6/behaviors/trace-behavior');
const Timeline = require('../../es6/core/timeline');


describe('TraceBehavior', function(){
  describe('Edit Trace Behavior', function(){
    it('should correctly edit a trace', function(){
        let titleDiv = document.createElement('div');
        titleDiv.innerHTML = this.test.title;
        document.body.appendChild(titleDiv);
        // Holder element for the timeline
        let timelineDiv = document.createElement("div");
        document.body.appendChild(timelineDiv);

        // Create a timeline
        let timeline = new Timeline();
        timeline.registerContainer(timelineDiv, {}, 'foo');

        // TimeContext
        let timeContext = new LayerTimeContext(timeline.timeContext)

        // Layer instanciation for a marker layer
        var data = [
          { x: 0,  mean: 0 ,  range: 0.1},
          { x: 1,  mean: 0.1, range: 0.2},
          { x: 2,  mean: 0.2, range: 0.1},
          { x: 3,  mean: 0.3, range: 0.3},
          { x: 4,  mean: 0.4, range: 0.1},
          { x: 5,  mean: 0.5, range: 0.2},
          { x: 6,  mean: 0.6, range: 0.1},
          { x: 7,  mean: 0.7, range: 0.3},
          { x: 8,  mean: 0.8, range: 0.1},
          { x: 9,  mean: 0.9, range: 0.2},
          { x: 10, mean: 1.0, range: 0.1},
          { x: 11, mean: 0.9, range: 0.3},
          { x: 12, mean: 0.8, range: 0.1}
        ];

        let layer = new Layer('collection', data);
        layer.setTimeContext(timeContext);
        layer.configureShape(TraceDots);
        layer.setBehavior(new TraceBehavior());
        layer.timeContext.duration = 12;

        // Attach layer to the timeline
        timeline.addLayer(layer, 'foo');
        ;
        timeline.drawLayersShapes();
        timeline.update();

        let item = layer.d3items.nodes()[0];
        const shape = layer._itemElShapeMap.get(item);
        console.log(shape, shape.mean, shape.min, shape.max)

        // For the mean
        layer.edit(item, 10, 0, shape.mean);
        assert.equal(layer.data[0].x, 0.1);
        assert.equal(layer.data[0].yMean, 0.0);
        assert.equal(layer.data[0].range, 0.1);

        layer.edit(item, 10, -10, shape.mean);

        assert.equal(layer.data[0].x, 0.2);
        assert.equal(layer.data[0].yMean, 0.1);
        assert.equal(layer.data[0].range, 0.1);

        layer.edit(item, 10, -10, shape.max);
        assert.equal(layer.data[0].x, 0.2);  // Don't move the x
        assert.equal(layer.data[0].yMean, 0.1);  // Don't change mean
        assert.equal(layer.data[0].range, 0.3);  // But change range (2*dy)

        layer.edit(item, 10, -10, shape.min);
        assert.equal(layer.data[0].x, 0.2);  // Don't move the x
        assert.equal(layer.data[0].yMean, 0.1);  // Don't change mean
        assert.equal(layer.data[0].range, 0.1);  // But change range (2*dy)

      });
  });
});
