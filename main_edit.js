import React from 'react';
import ReactDOM from 'react-dom';
import EditRainfallCard from './src/js/edit_rainfall_card.jsx';

ProtoGraph.Card.toRainfall.prototype.getData = function (data) {
  return this.containerInstance.exportData();
}

ProtoGraph.Card.toRainfall.prototype.renderSEO = function (data) {
  this.renderMode = 'SEO';
  return this.containerInstance.renderSEO();
}

ProtoGraph.Card.toRainfall.prototype.renderEdit = function (onPublishCallback) {
  this.mode = 'edit';
  this.onPublishCallback = onPublishCallback;
  ReactDOM.render(
    <EditRainfallCard
      dataURL={this.options.data_url}
      schemaURL={this.options.schema_url}
      uiSchemaURL={this.options.ui_schema_url}
      optionalConfigURL={this.options.configuration_url}
      optionalConfigSchemaURL={this.options.configuration_schema_url}
      onPublishCallback={this.onPublishCallback}
      mode={this.mode}
      ref={(e) => {
        this.containerInstance = this.containerInstance || e;
      }}/>,
    this.options.selector);
}