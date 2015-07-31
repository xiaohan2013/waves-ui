'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = timeGenerator;

var _utilsFormat = require('../utils/format');

/**
 * maybe create a factory to give some parameters
 * create time serie data, to visualize a time scale
 */

function timeGenerator(timeContext) {
  var duration = timeContext.visibleDuration;
  var offset = timeContext.offset;
  var data = [];

  // const min = Math.min(-offset, 0);
  var min = -offset;
  // remove the timeline's offset to keep the layer centered
  var max = duration - offset;

  // define pixels for 1 second
  var ps = timeContext.computedPixelsPerSecond;
  var minStep = 7;

  // define all display information according to the pixelsPerSecond ratio
  var step = undefined,
      type = undefined,
      toFixed = undefined,
      markerModulo = undefined,
      includeModulo = undefined;

  if (ps * 4 > minStep) {
    step = 1; // the step to use to compute time
    toFixed = 0;
    markerModulo = 60; // a timestamp every 5 steps
    includeModulo = 5; // a tick every 5 steps
    type = '60sec';
  }

  if (ps * 2 > minStep) {
    step = 1;
    toFixed = 0;
    markerModulo = 30;
    includeModulo = 2;
    type = '30sec';
  }

  if (ps > minStep) {
    step = 1;
    toFixed = 0;
    markerModulo = 10;
    includeModulo = 1;
    type = 'sec';
  }

  if (ps / 10 > minStep) {
    step = 1 / 10;
    toFixed = 1;
    markerModulo = 10;
    includeModulo = 1;
    type = 'ds';
  }

  if (ps / 100 > minStep) {
    step = 1 / 100;
    toFixed = 2;
    markerModulo = 10;
    includeModulo = 1;
    type = 'cs';
  }

  if (ps / 1000 > minStep) {
    step = 1 / 1000;
    toFixed = 3;
    markerModulo = 10;
    includeModulo = 1;
    type = 'ms';
  }

  for (var time = min; time < max; time += step) {
    var formattedTime = time.toFixed(toFixed);

    if (Math.round(formattedTime / step) % includeModulo !== 0) {
      continue;
    }

    // avoid floating point errors
    var marker = Math.round(formattedTime / step) % markerModulo === 0 ? true : false;

    var datum = { x: formattedTime, marker: marker };

    if (marker === true) {
      var date = new Date(1000 * formattedTime);
      var _min = (0, _utilsFormat.padLeft)(date.getMinutes(), 0, 2);
      var sec = (0, _utilsFormat.padLeft)(date.getSeconds(), 0, 2);
      var milli = (0, _utilsFormat.padLeft)(date.getMilliseconds(), 0, 3);
      var label = _min + ':' + sec + ':' + milli;

      datum.label = label;
    }

    data.push(datum);
  }

  return data;
}

module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9heGlzL3RpbWUtYXhpcy1nZW5lcmF0b3IuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7cUJBS3dCLGFBQWE7OzJCQUxiLGlCQUFpQjs7Ozs7OztBQUsxQixTQUFTLGFBQWEsQ0FBQyxXQUFXLEVBQUU7QUFDakQsTUFBTSxRQUFRLEdBQUcsV0FBVyxDQUFDLGVBQWUsQ0FBQztBQUM3QyxNQUFNLE1BQU0sR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDO0FBQ2xDLE1BQU0sSUFBSSxHQUFHLEVBQUUsQ0FBQzs7O0FBR2hCLE1BQU0sR0FBRyxHQUFHLENBQUUsTUFBTSxDQUFDOztBQUVyQixNQUFNLEdBQUcsR0FBRyxRQUFRLEdBQUcsTUFBTSxDQUFDOzs7QUFHOUIsTUFBTSxFQUFFLEdBQUcsV0FBVyxDQUFDLHVCQUF1QixDQUFDO0FBQy9DLE1BQU0sT0FBTyxHQUFHLENBQUMsQ0FBQzs7O0FBR2xCLE1BQUksSUFBSSxZQUFBO01BQUUsSUFBSSxZQUFBO01BQUUsT0FBTyxZQUFBO01BQUUsWUFBWSxZQUFBO01BQUUsYUFBYSxZQUFBLENBQUM7O0FBRXJELE1BQUksRUFBRSxHQUFHLENBQUMsR0FBRyxPQUFPLEVBQUU7QUFDcEIsUUFBSSxHQUFHLENBQUMsQ0FBQztBQUNULFdBQU8sR0FBRyxDQUFDLENBQUM7QUFDWixnQkFBWSxHQUFHLEVBQUUsQ0FBQztBQUNsQixpQkFBYSxHQUFHLENBQUMsQ0FBQztBQUNsQixRQUFJLEdBQUcsT0FBTyxDQUFDO0dBQ2hCOztBQUVELE1BQUksRUFBRSxHQUFHLENBQUMsR0FBRyxPQUFPLEVBQUU7QUFDcEIsUUFBSSxHQUFHLENBQUMsQ0FBQztBQUNULFdBQU8sR0FBRyxDQUFDLENBQUM7QUFDWixnQkFBWSxHQUFHLEVBQUUsQ0FBQztBQUNsQixpQkFBYSxHQUFHLENBQUMsQ0FBQztBQUNsQixRQUFJLEdBQUcsT0FBTyxDQUFDO0dBQ2hCOztBQUVELE1BQUksRUFBRSxHQUFHLE9BQU8sRUFBRTtBQUNoQixRQUFJLEdBQUcsQ0FBQyxDQUFDO0FBQ1QsV0FBTyxHQUFHLENBQUMsQ0FBQztBQUNaLGdCQUFZLEdBQUcsRUFBRSxDQUFDO0FBQ2xCLGlCQUFhLEdBQUcsQ0FBQyxDQUFDO0FBQ2xCLFFBQUksR0FBRyxLQUFLLENBQUM7R0FDZDs7QUFFRCxNQUFJLEVBQUUsR0FBRyxFQUFFLEdBQUcsT0FBTyxFQUFFO0FBQ3JCLFFBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQ2QsV0FBTyxHQUFHLENBQUMsQ0FBQztBQUNaLGdCQUFZLEdBQUcsRUFBRSxDQUFDO0FBQ2xCLGlCQUFhLEdBQUcsQ0FBQyxDQUFDO0FBQ2xCLFFBQUksR0FBRyxJQUFJLENBQUM7R0FDYjs7QUFFRCxNQUFJLEVBQUUsR0FBRyxHQUFHLEdBQUcsT0FBTyxFQUFFO0FBQ3RCLFFBQUksR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDO0FBQ2YsV0FBTyxHQUFHLENBQUMsQ0FBQztBQUNaLGdCQUFZLEdBQUcsRUFBRSxDQUFDO0FBQ2xCLGlCQUFhLEdBQUcsQ0FBQyxDQUFDO0FBQ2xCLFFBQUksR0FBRyxJQUFJLENBQUM7R0FDYjs7QUFFRCxNQUFJLEVBQUUsR0FBRyxJQUFJLEdBQUcsT0FBTyxFQUFFO0FBQ3ZCLFFBQUksR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDO0FBQ2hCLFdBQU8sR0FBRyxDQUFDLENBQUM7QUFDWixnQkFBWSxHQUFHLEVBQUUsQ0FBQztBQUNsQixpQkFBYSxHQUFHLENBQUMsQ0FBQztBQUNsQixRQUFJLEdBQUcsSUFBSSxDQUFDO0dBQ2I7O0FBRUQsT0FBSyxJQUFJLElBQUksR0FBRyxHQUFHLEVBQUUsSUFBSSxHQUFHLEdBQUcsRUFBRSxJQUFJLElBQUksSUFBSSxFQUFFO0FBQzdDLFFBQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7O0FBRTVDLFFBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLEdBQUcsYUFBYSxLQUFLLENBQUMsRUFBRTtBQUMxRCxlQUFTO0tBQ1Y7OztBQUdELFFBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxHQUFHLFlBQVksS0FBSyxDQUFDLEdBQUcsSUFBSSxHQUFHLEtBQUssQ0FBQzs7QUFFcEYsUUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDLEVBQUUsYUFBYSxFQUFFLE1BQU0sRUFBTixNQUFNLEVBQUUsQ0FBQzs7QUFFM0MsUUFBSSxNQUFNLEtBQUssSUFBSSxFQUFFO0FBQ25CLFVBQU0sSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLElBQUksR0FBRyxhQUFhLENBQUMsQ0FBQztBQUM1QyxVQUFNLElBQUcsR0FBRyxpQkFwRlQsT0FBTyxFQW9GVSxJQUFJLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzdDLFVBQU0sR0FBRyxHQUFHLGlCQXJGVCxPQUFPLEVBcUZVLElBQUksQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDN0MsVUFBTSxLQUFLLEdBQUcsaUJBdEZYLE9BQU8sRUFzRlksSUFBSSxDQUFDLGVBQWUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNwRCxVQUFNLEtBQUssR0FBTSxJQUFHLFNBQUksR0FBRyxTQUFJLEtBQUssQUFBRSxDQUFDOztBQUV2QyxXQUFLLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztLQUNyQjs7QUFFRCxRQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0dBQ2xCOztBQUVELFNBQU8sSUFBSSxDQUFDO0NBQ2IiLCJmaWxlIjoiZXM2L2F4aXMvdGltZS1heGlzLWdlbmVyYXRvci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHBhZExlZnQgfSBmcm9tICcuLi91dGlscy9mb3JtYXQnO1xuLyoqXG4gKiBtYXliZSBjcmVhdGUgYSBmYWN0b3J5IHRvIGdpdmUgc29tZSBwYXJhbWV0ZXJzXG4gKiBjcmVhdGUgdGltZSBzZXJpZSBkYXRhLCB0byB2aXN1YWxpemUgYSB0aW1lIHNjYWxlXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHRpbWVHZW5lcmF0b3IodGltZUNvbnRleHQpIHtcbiAgY29uc3QgZHVyYXRpb24gPSB0aW1lQ29udGV4dC52aXNpYmxlRHVyYXRpb247XG4gIGNvbnN0IG9mZnNldCA9IHRpbWVDb250ZXh0Lm9mZnNldDtcbiAgY29uc3QgZGF0YSA9IFtdO1xuXG4gIC8vIGNvbnN0IG1pbiA9IE1hdGgubWluKC1vZmZzZXQsIDApO1xuICBjb25zdCBtaW4gPSAtIG9mZnNldDtcbiAgLy8gcmVtb3ZlIHRoZSB0aW1lbGluZSdzIG9mZnNldCB0byBrZWVwIHRoZSBsYXllciBjZW50ZXJlZFxuICBjb25zdCBtYXggPSBkdXJhdGlvbiAtIG9mZnNldDtcblxuICAvLyBkZWZpbmUgcGl4ZWxzIGZvciAxIHNlY29uZFxuICBjb25zdCBwcyA9IHRpbWVDb250ZXh0LmNvbXB1dGVkUGl4ZWxzUGVyU2Vjb25kO1xuICBjb25zdCBtaW5TdGVwID0gNztcblxuICAvLyBkZWZpbmUgYWxsIGRpc3BsYXkgaW5mb3JtYXRpb24gYWNjb3JkaW5nIHRvIHRoZSBwaXhlbHNQZXJTZWNvbmQgcmF0aW9cbiAgbGV0IHN0ZXAsIHR5cGUsIHRvRml4ZWQsIG1hcmtlck1vZHVsbywgaW5jbHVkZU1vZHVsbztcblxuICBpZiAocHMgKiA0ID4gbWluU3RlcCkge1xuICAgIHN0ZXAgPSAxOyAvLyB0aGUgc3RlcCB0byB1c2UgdG8gY29tcHV0ZSB0aW1lXG4gICAgdG9GaXhlZCA9IDA7XG4gICAgbWFya2VyTW9kdWxvID0gNjA7IC8vIGEgdGltZXN0YW1wIGV2ZXJ5IDUgc3RlcHNcbiAgICBpbmNsdWRlTW9kdWxvID0gNTsgLy8gYSB0aWNrIGV2ZXJ5IDUgc3RlcHNcbiAgICB0eXBlID0gJzYwc2VjJztcbiAgfVxuXG4gIGlmIChwcyAqIDIgPiBtaW5TdGVwKSB7XG4gICAgc3RlcCA9IDE7XG4gICAgdG9GaXhlZCA9IDA7XG4gICAgbWFya2VyTW9kdWxvID0gMzA7XG4gICAgaW5jbHVkZU1vZHVsbyA9IDI7XG4gICAgdHlwZSA9ICczMHNlYyc7XG4gIH1cblxuICBpZiAocHMgPiBtaW5TdGVwKSB7XG4gICAgc3RlcCA9IDE7XG4gICAgdG9GaXhlZCA9IDA7XG4gICAgbWFya2VyTW9kdWxvID0gMTA7XG4gICAgaW5jbHVkZU1vZHVsbyA9IDE7XG4gICAgdHlwZSA9ICdzZWMnO1xuICB9XG5cbiAgaWYgKHBzIC8gMTAgPiBtaW5TdGVwKSB7XG4gICAgc3RlcCA9IDEgLyAxMDtcbiAgICB0b0ZpeGVkID0gMTtcbiAgICBtYXJrZXJNb2R1bG8gPSAxMDtcbiAgICBpbmNsdWRlTW9kdWxvID0gMTtcbiAgICB0eXBlID0gJ2RzJztcbiAgfVxuXG4gIGlmIChwcyAvIDEwMCA+IG1pblN0ZXApIHtcbiAgICBzdGVwID0gMSAvIDEwMDtcbiAgICB0b0ZpeGVkID0gMjtcbiAgICBtYXJrZXJNb2R1bG8gPSAxMDtcbiAgICBpbmNsdWRlTW9kdWxvID0gMTtcbiAgICB0eXBlID0gJ2NzJztcbiAgfVxuXG4gIGlmIChwcyAvIDEwMDAgPiBtaW5TdGVwKSB7XG4gICAgc3RlcCA9IDEgLyAxMDAwO1xuICAgIHRvRml4ZWQgPSAzO1xuICAgIG1hcmtlck1vZHVsbyA9IDEwO1xuICAgIGluY2x1ZGVNb2R1bG8gPSAxO1xuICAgIHR5cGUgPSAnbXMnO1xuICB9XG5cbiAgZm9yIChsZXQgdGltZSA9IG1pbjsgdGltZSA8IG1heDsgdGltZSArPSBzdGVwKSB7XG4gICAgY29uc3QgZm9ybWF0dGVkVGltZSA9IHRpbWUudG9GaXhlZCh0b0ZpeGVkKTtcblxuICAgIGlmIChNYXRoLnJvdW5kKGZvcm1hdHRlZFRpbWUgLyBzdGVwKSAlIGluY2x1ZGVNb2R1bG8gIT09IDApIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8vIGF2b2lkIGZsb2F0aW5nIHBvaW50IGVycm9yc1xuICAgIGNvbnN0IG1hcmtlciA9IE1hdGgucm91bmQoZm9ybWF0dGVkVGltZSAvIHN0ZXApICUgbWFya2VyTW9kdWxvID09PSAwID8gdHJ1ZSA6IGZhbHNlO1xuXG4gICAgY29uc3QgZGF0dW0gPSB7IHg6IGZvcm1hdHRlZFRpbWUsIG1hcmtlciB9O1xuXG4gICAgaWYgKG1hcmtlciA9PT0gdHJ1ZSkge1xuICAgICAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKDEwMDAgKiBmb3JtYXR0ZWRUaW1lKTtcbiAgICAgIGNvbnN0IG1pbiA9IHBhZExlZnQoZGF0ZS5nZXRNaW51dGVzKCksIDAsIDIpO1xuICAgICAgY29uc3Qgc2VjID0gcGFkTGVmdChkYXRlLmdldFNlY29uZHMoKSwgMCwgMik7XG4gICAgICBjb25zdCBtaWxsaSA9IHBhZExlZnQoZGF0ZS5nZXRNaWxsaXNlY29uZHMoKSwgMCwgMyk7XG4gICAgICBjb25zdCBsYWJlbCA9IGAke21pbn06JHtzZWN9OiR7bWlsbGl9YDtcblxuICAgICAgZGF0dW0ubGFiZWwgPSBsYWJlbDtcbiAgICB9XG5cbiAgICBkYXRhLnB1c2goZGF0dW0pO1xuICB9XG5cbiAgcmV0dXJuIGRhdGE7XG59Il19