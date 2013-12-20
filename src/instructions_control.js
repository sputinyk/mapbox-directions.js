'use strict';

var d3 = require('./d3'),
    format = require('./format');

module.exports = function (container, directions) {
    var control = {}, map;

    control.addTo = function (_) {
        map = _;
        return control;
    };

    container = d3.select(L.DomUtil.get(container));

    directions.on('load', function (e) {
        var route = e.routes[0];

        container.html('');

        var header = container.append('div')
            .attr('class', 'header space-bottom1');

        header.append('h3')
            .attr('class', 'pad1')
            .text('Directions ')
            .append('span')
            .attr('class', 'quiet')
            .text('(' + format.imperial(route.distance) + ', ' + format.duration(route.duration) + ')');

        header.append('div')
            .attr('class', 'box pad1')
            .text(route.summary);

        var legs = container.append('ol')
            .selectAll('li')
            .data(route.legs)
            .enter().append('li');

        var steps = legs.append('ol')
            .selectAll('li')
            .data(function (leg) { return leg.steps; })
            .enter().append('li');

        steps.append('span')
            .attr('class', 'col10')
            .text(function (step) { return step.maneuver.instruction; });

        steps.append('span')
            .attr('class', 'col2')
            .text(function (step) { return format.imperial(step.distance); });

        steps.on('mouseover', function (step) {
            directions.highlightStep(step);
        });

        steps.on('mouseout', function () {
            directions.highlightStep(null);
        });

        steps.on('click', function (step) {
            map.panTo(L.GeoJSON.coordsToLatLng(step.maneuver.location.coordinates));
        });
    });

    return control;
};
