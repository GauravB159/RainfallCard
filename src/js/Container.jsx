import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

export default class RainfallCard extends React.Component {
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
        width : "640px"
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
      let maxRange = 115;
      let multiplier = (maxRange - minRange)/(maxDomain - minDomain);
      heights = heights.map((height) => {return minRange + multiplier * (height - minDomain)});
      return (
        <div id="protograph-div" style={styles}>
          <div className="protograph-card" style={{width:"640px",height:"340px",overflow:"visible"}}>
            <div className="protograph-cloud-wrapper">
              <img className="protograph-header-cloud" src="../../src/img/cloud-icon.png"/>
            </div>
            <div className="protograph-place">Agra</div>
            <h3 className="ui header" style={{margin:'10px',marginTop:'0'}}>Rainfall</h3>
            <div className="protograph-tab-cont" style={{width:"640px",overflowX:"auto"}}>
              <div className="protograph-tabs" style={{width:"640px",overflowX:"hidden"}}>
              {
                years.map((year,index)=>{
                  return (
                    <div className="protograph-tab-container" id={index === 0 ? "protograph_color" : ""} onClick={()=> this.handleClick(index)} style={{width:100/years.length+"%"}}>
                      <div className="protograph-tab">
                        {year}
                      </div>
                    </div>
                  )
                })
              }
              </div>
            </div>
            <img className="protograph-body-cloud" src="../../src/img/cloud-icon.png"/>
            <div className="protograph-annual" style={{width:"320px"}}>
              <div className="protograph-annual-header">Annual Rainfall</div>
              <h2 className="protograph-annual-average">Average</h2>
              <div className="protograph-annual-value">{this.state.currData.annual} mm</div>
            </div>
            <div className="protograph-right">
              <div className="protograph-average">
                <div className="protograph-average-line"/>
                <div className="protograph-average-text">
                  Average line
                </div>
              </div>
              <div className="protograph-values" style={{width:"300px",height:"50%"}}>
                {
                  values.map((value,index)=>{
                    return(
                      <div className="protograph-value" style={{left:75*index - 6 +"px"}}>
                        <div className="protograph-rainfall">
                          { value.rainfall + " mm"}
                        </div>
                        <div className="protograph-bottle" style={index%2 === 0 ? { top:"-19px",marginTop:"44px"} : {}}>
                          <div className="protograph-ticks">
                            {
                              ticks.map((length,index)=>{
                                return (
                                  <hr style={{width:length}}/>
                                );
                              })
                            }
                          </div>
                          <img src="../../src/img/small-waves.svg" style={{bottom:heights[index],position:"absolute",width:"29px"}}/>
                          <div className="protograph-bottle-average" style={{bottom:heights[index]+8}}/>
                          <div className="protograph-water" style={{height:heights[index], backgroundColor:"#4A90E2",position:"absolute"}}/>
                          <div className="protograph-svg">
                            <svg width="50px" height="10px">
                              <path d="M12 0 L8 5 H 44 L41 0" fill="transparent" style={{fill:'#4A90E2'}}/>
                            </svg>
                          </div>
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
            <div style={{position:"absolute",bottom:"0px"}}>
              <hr style={{width:"638px",marginBottom:"0",opacity:"0.2"}}/>
              <div className="protograph-site">www.jagran.com</div>
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
        width : "98%",
        maxWidth:"320px"
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
          ticks.push(8)
        }else if(i%4===0){
          ticks.push(4)
        }else{
          ticks.push(2);
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
      let maxRange = 115;
      let multiplier = (maxRange - minRange)/(maxDomain - minDomain);
      heights = heights.map((height) => {return minRange + multiplier * (height - minDomain)});
      return (
        <div id="protograph-div" style={styles}>
          <div className="protograph-card" style={styles}>
            <div className="protograph-cloud-wrapper">
              <img className="protograph-header-cloud" src="../../src/img/cloud-icon.png"/>
            </div>
            <div className="protograph-place">Agra</div>
            <h3 className="ui header" style={{margin:'10px',marginTop:'0'}}>Rainfall</h3>
            <div className="protograph-tab-cont" style={{width:"100%",overflowX:"auto"}}>
              <div className="protograph-tabs" style={{width:"400px",overflowX:"hidden"}}>
              {
                years.map((year,index)=>{
                  return (
                    <div className="protograph-tab-container" id={index === 0 ? "protograph_color" : ""} onClick={()=> this.handleClick(index)} style={{width:"80px"}}>
                      <div className="protograph-tab">
                        {year}
                      </div>
                    </div>
                  )
                })
              }
              </div>
            </div>
            <img className="protograph-body-mobile-cloud" src="../../src/img/cloud-icon.png"/>
            <div className="protograph-annual" style={{width:"100%"}}>
              <div className="protograph-annual-header">Annual Rainfall</div>
              <h2 className="protograph-annual-average">Average</h2>
              <div className="protograph-annual-value">{this.state.currData.annual} mm</div>
            </div>
            <div className="protograph-average">
              <div className="protograph-average-line"/>
              <div className="protograph-average-text">
                Average line
              </div>
            </div>
            <div className="protograph-values" style={{width:"100%"}}>
              {
                values.map((value,index)=>{
                  return(
                    <div className="protograph-value" style={{left:25*index - 1 +"%"}}>
                      <div className="protograph-rainfall">
                        { value.rainfall + " mm"}
                      </div>
                      <div className="protograph-bottle" style={index%2 === 0 ? { top:"-19px",marginTop:"44px"} : {}}>
                        <div className="protograph-ticks">
                          {
                            ticks.map((length,index)=>{
                              return (
                                <hr style={{width:length}}/>
                              );
                            })
                          }
                        </div>
                        <div style={{bottom:heights[index]-1,position:"absolute",width:"30px",height:"15px"}}>
                          <img src="../../src/img/small-waves.svg" style={{width:"100%"}}/> 
                        </div>                       
                        <div className="protograph-bottle-average" style={{bottom:heights[index]+8}}/>
                        <div className="protograph-water" style={{height:heights[index], backgroundColor:"#4A90E2",position:"absolute"}}/>
                        <div className="protograph-svg">
                          <svg width="50px" height="10px">
                            <path d="M12 0 L8 5 H 46 L42 0" fill="transparent" style={{marginTop:"-1px",fill:'#4A90E2'}}/>
                          </svg>
                        </div>
                        <div className="protograph-season">
                          { value.season_name}
                        </div>
                      </div>
                    </div>
                  );                  
                })
              }
            </div>
            <div style={{position:"absolute",bottom:"0px",width:"98%",maxWidth:"320px"}}>
              <hr style={{width:"97%",marginBottom:"0",opacity:"0.2"}}/>
              <div className="protograph-site">www.jagran.com</div>
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
      let styles = {
        width : "100%"
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
          ticks.push(8)
        }else if(i%4===0){
          ticks.push(4)
        }else{
          ticks.push(2);
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
      let maxRange = 115;
      let multiplier = (maxRange - minRange)/(maxDomain - minDomain);
      heights = heights.map((height) => {return minRange + multiplier * (height - minDomain)});
      return (
        <div id="ProtoScreenshot">
          <div className="protograph-card" style={styles}>
            <div className="protograph-cloud-wrapper">
              <img className="protograph-header-cloud" src="src/img/cloud-icon.png"/>
            </div>
            <div className="protograph-place">Agra</div>
            <h3 className="ui header" style={{margin:'0 15px'}}>Rainfall</h3>
            <div className="protograph-values" style={{width:"100%",marginTop:"-10px"}}>
              {
                values.map((value,index)=>{
                  return(
                    <div className="protograph-value" style={{left:25*index+1 +"%"}}>
                      <div className="protograph-rainfall">
                        { value.rainfall + " mm"}
                      </div>
                      <div className="protograph-bottle" style={index%2 === 0 ? { top:"-19px",marginTop:"44px"} : {}}>
                        <div className="protograph-ticks">
                          {
                            ticks.map((length,index)=>{
                              return (
                                <hr style={{width:length}}/>
                              );
                            })
                          }
                        </div>
                        <div style={{bottom:heights[index]-2,position:"absolute",width:"30px",height:"15px"}}>
                          <img src="src/img/small-waves.svg" style={{width:"100%"}}/> 
                        </div>                       
                        <div className="protograph-bottle-average" style={{bottom:heights[index]+8}}/>
                        <div className="protograph-water" style={{height:heights[index], backgroundColor:"#4A90E2",position:"absolute"}}/>
                        <div className="protograph-svg">
                          <svg width="50px" height="10px">
                            <path d="M12 0 L8 5 H 46 L42 0" fill="transparent" style={{marginTop:"-1px",fill:'#4A90E2'}}/>
                          </svg>
                        </div>
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