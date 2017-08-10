import React from 'react';
import ReactDOM from 'react-dom';
import RainfallCard from './src/js/Container.jsx';

window.ProtoGraph = window.ProtoGraph || {};
window.ProtoGraph.Card = window.ProtoGraph.Card || {};


ProtoGraph.Card.toRainfall = function () {
  this.cardType = 'RainfallCard';
}

ProtoGraph.Card.toRainfall.prototype.init = function (options) {
  this.options = options;
}

ProtoGraph.Card.toRainfall.prototype.getData = function (data) {
  return this.containerInstance.exportData();
}

ProtoGraph.Card.toRainfall.prototype.renderLaptop = function (data) {
  this.mode = 'laptop';
  ReactDOM.render(
    <RainfallCard
      dataURL={this.options.data_url}
      schemaURL={this.options.schema_url}
      optionalConfigURL={this.options.configuration_url}
      optionalConfigSchemaURL={this.options.configuration_schema_url}
      mode={this.mode}
      ref={(e) => {
        this.containerInstance = this.containerInstance || e;
      }}/>,
    this.options.selector);
}

ProtoGraph.Card.toRainfall.prototype.renderMobile = function (data) {
  this.mode = 'mobile';
  ReactDOM.render(
    <RainfallCard
      dataURL={this.options.data_url}
      schemaURL={this.options.schema_url}
      optionalConfigURL={this.options.configuration_url}
      optionalConfigSchemaURL={this.options.configuration_schema_url}
      mode={this.mode}
      ref={(e) => {
        this.containerInstance = this.containerInstance || e;
      }}/>,
    this.options.selector);
}

ProtoGraph.Card.toRainfall.prototype.renderScreenshot = function (data) {
  this.mode = 'screenshot';
  ReactDOM.render(
    <RainfallCard
      dataURL={this.options.data_url}
      schemaURL={this.options.schema_url}
      optionalConfigURL={this.options.configuration_url}
      optionalConfigSchemaURL={this.options.configuration_schema_url}
      mode={this.mode}
      ref={(e) => {
        this.containerInstance = this.containerInstance || e;
      }}/>,
    this.options.selector);
}

