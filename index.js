'use strict'

const svg = require('virtual-hyperscript-svg')
const mercator = require('projections/p/mercator')
const flatten = require('geojson-flatten')

const drawPath = (points, stroke, strokeWidth) =>
	svg('polyline', {
		points: points.map((point) => point.join(',')).join(' '),
		fill: 'none', stroke, "stroke-width": strokeWidth
	})

const paths = (geojson) => {
	geojson = flatten(geojson)
	let result = []
	if(geojson.type=='FeatureCollection'){
		for(let feature of geojson.features){
			if(feature.geometry.type=='Polygon'){
				result.push(feature.geometry.coordinates[0])
			}
			else throw new Error('This GeoJSON geometry type is not supported (yet). Type: '+feature.geometry.type)
		}
	}
	else throw new Error('This GeoJSON type is not supported (yet). Type: '+geojson.type)
	return result
}

const defaults = {
	projection: ([lon, lat]) => {
		const {x, y} = mercator({lon, lat})
		return [x * 100, y * 100] // todo
	},
	lineColor: '#000',
	lineWidth: .1
}

const draw = (geojson, opt) => {
	opt = Object.assign({}, defaults, opt || {})

	return paths(geojson)
	.map((points) => points.map(opt.projection))
	.map((points) => drawPath(points, opt.lineColor, opt.lineWidth))
}

module.exports = Object.assign(draw, {defaults})
