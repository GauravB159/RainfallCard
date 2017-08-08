import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

export default class ExplainerCard extends React.Component {
  constructor(props) {
    super(props)

    let stateVar = {
      fetchingData: true,
      dataJSON: {
        card_data: {},
        configs: {}
      },
      schemaJSON: undefined,
      optionalConfigJSON: {},
      optionalConfigSchemaJSON: undefined
    };
    if (this.props.dataJSON) {
      stateVar.fetchingData = false;
      stateVar.dataJSON = this.props.dataJSON;
    }

    if (this.props.schemaJSON) {
      stateVar.schemaJSON = this.props.schemaJSON;
    }

    if (this.props.optionalConfigJSON) {
      stateVar.optionalConfigJSON = this.props.optionalConfigJSON;
    }

    if (this.props.optionalConfigSchemaJSON) {
      stateVar.optionalConfigSchemaJSON = this.props.optionalConfigSchemaJSON;
    }

    this.state = stateVar;
  }

  exportData() {
    return document.getElementById('protograph-div').getBoundingClientRect();
  }

  componentDidMount() {
    // get sample json data based on type i.e string or object
    if (this.state.fetchingData){
      axios.all([axios.get(this.props.dataURL), axios.get(this.props.schemaURL), axios.get(this.props.optionalConfigURL), axios.get(this.props.optionalConfigSchemaURL)])
        .then(axios.spread((card, schema, opt_config, opt_config_schema) => {
          this.setState({
            fetchingData: false,
            dataJSON: {
              card_data: card.data,
              configs: opt_config.data
            },
            currData: card.data.data.years[0],
            schemaJSON: schema.data,
            optionalConfigJSON: opt_config.data,
            optionalConfigSchemaJSON: opt_config_schema.data
          });
        }));
    } else {
      this.componentDidUpdate();
    }
  }

  componentDidUpdate() {
    if (this.props.mode === 'mobile' || this.props.mode === 'laptop'){
      let elem = document.querySelector('.protograph-explainer-text')
    }
  }
  handleClick(index){
    let data=this.state.dataJSON.card_data.data.years;
    let tab=document.getElementsByClassName("protograph-tab-container")[index];
    let activeTab=document.getElementById("protograph_color");
    activeTab.removeAttribute("id");
    tab.id="protograph_color";
    this.setState({
      currData:data[index]
    });
  }
  renderLaptop() {
    if (this.state.schemaJSON === undefined ){
      return(<div>Loading</div>)
    } else {
      const data = this.state.dataJSON.card_data;
      let styles = {
        width : "300px"
      }
      let years=[];
      data.data.years.forEach((datum)=>{
        years.push(datum.year_no);
      });
      let values = this.state.currData.seasons;
      let tab_width=(300)/years.length + "px";
      let ticks=[];
      for(let i=0;i <= 48;i++){
        if(i%8===0){
          ticks.push(9)
        }else if(i%4===0){
          ticks.push(6)
        }else{
          ticks.push(3);
        }
      }
      let minDomain = 0;
      let maxDomain = values[0].rainfall;
      let heights=[];
      data.data.years.forEach((datum)=>{
        datum.seasons.forEach((value)=>{
          if(value.rainfall > maxDomain)
            maxDomain = value.rainfall;
          if(value.rainfall < minDomain)
            minDomain = value.rainfall;
        });
      });
      values.forEach((value)=>{
        heights.push(value.rainfall);
      })
      let minRange = 2;
      let maxRange = 145;
      let multiplier = (maxRange - minRange)/(maxDomain - minDomain);
      heights = heights.map((height) => {return minRange + multiplier * (height - minDomain)});
      return (
        <div id="protograph-div" style={styles}>
          <div className="protograph-card">
            <h2 className="ui header" style={{margin:'15px',marginBottom:'0'}}>Rainfall</h2>
            <div className="protograph-tabs">
            {
              years.map((year,index)=>{
                return (
                  <div className="protograph-tab-container" id={index === 0 ? "protograph_color" : ""} onClick={()=> this.handleClick(index)} style={{width:tab_width}}>
                    <div className="protograph-tab">
                      {year}
                    </div>
                  </div>
                )
              })
            }
            </div>
            <div className="protograph-annual" style={{width:"300px"}}>
              <div className="protograph-annual-header">Annual Rainfall</div>
              <div className="protograph-annual-value">{this.state.currData.annual}mm</div>
            </div>
            <div className="protograph-average">
              <div className="protograph-average-line"/>
              <div className="protograph-average-text">
                Average line
              </div>
            </div>
            <div className="protograph-values" style={{width:"300px"}}>
              {
                values.map((value,index)=>{
                  return(
                    <div className="protograph-value">
                      <div className="protograph-rainfall">
                        { value.rainfall + "mm"}
                      </div>
                      <div className="protograph-bottle">
                        <div className="protograph-ticks">
                          {
                            ticks.map((length,index)=>{
                              return (
                                <hr style={{width:length}}/>
                              );
                            })
                          }
                        </div>
                        <div className="protograph-water" style={{height:heights[index], backgroundColor:"#4A90E2",marginTop:heights[index] > 7 ? 7-heights[index] : 14-heights[index]}}/>
                        <div className="protograph-season">
                          { value.season_name}
                        </div>
                      </div>
                    </div>
                  );                  
                })
              }
            </div>
          </div>
        </div>
      )
    }
  }

  renderMobile() {
    if (this.state.schemaJSON === undefined ){
      return(<div>Loading</div>)
    } else {
      const data = this.state.dataJSON.card_data;
      let styles = {
        width : "300px"
      }
      return (
        <div id="protograph-div" style={styles}>
          <div className="protograph-card">
            {(data.data.hasOwnProperty('tag') && data.data.tag !== "undefined" && data.data.tag !== '' ) ? <p className="protograph-tag">#{data.data.tag}</p>: ''}
            <h3 className="ui header" style={{marginBottom: '15px'}}>{data.data.explainer_header}</h3>
            <p className="protograph-explainer-text">{data.data.explainer_text}</p>
            <div className="protograph-footer">
              <div className="protograph-credits"><a className="protograph-card-link" href="https://protograph.pykih.com/card/toexplain" target="_blank">toExplain</a></div>
            </div>
          </div>
        </div>
      )
    }
  }

  renderScreenshot() {
    if (this.state.schemaJSON === undefined ){
      return(<div>Loading</div>)
    } else {
      const data = this.state.dataJSON.card_data;
      return (
        <div id="ProtoScreenshot">
          <div className="protograph-card">
            <p>{data.data.explainer_text}</p>
          </div>
        </div>
      )
    }
  }

  render() {
    switch(this.props.mode) {
      case 'laptop' :
        return this.renderLaptop();
        break;
      case 'mobile' :
        return this.renderMobile();
        break;
      case 'screenshot' :
        return this.renderScreenshot();
        break;
    }
  }
}