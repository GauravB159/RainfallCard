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
      optionalConfigSchemaJSON: undefined,
      currData:{},
      currIndex:0
    };
    if (this.props.dataJSON) {
      stateVar.fetchingData = false;
      stateVar.dataJSON = this.props.dataJSON;
      stateVar.currData = this.props.dataJSON.card_data.data.years[this.props.dataJSON.card_data.data.years.length -1];
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
            currData: card.data.data.years[card.data.data.years.length-1],
            currIndex:card.data.data.years.length-1,
            schemaJSON: schema.data,
            optionalConfigJSON: opt_config.data,
            optionalConfigSchemaJSON: opt_config_schema.data
          });
        }));
    } 
  }


  handleClick(e){
    e.stopPropagation();
    let data=this.state.dataJSON.card_data.data.years;
    let tab=e.target;
    let index=data.findIndex((datum)=>tab.parentNode.firstChild.innerHTML === datum.year);
    let activeTab=document.getElementById("protograph_color");
    activeTab.id="protograph_inactive";
    tab.id="protograph_color";
    this.setState({
      currData:data[index],
      currIndex:index
    });
  }
  componentWillReceiveProps(){
    let data=JSON.parse(JSON.stringify(this.props.dataJSON));
    data.card_data.data.years.sort((a,b)=>{
      return a.year-b.year;
    });
    this.state.dataJSON=data;
    this.state.currData = data.card_data.data.years[this.state.currIndex];
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
        years.push(datum);
      });
      let imgs=['winter.png','rainfall.png','monsoon.png','rainfall.png'];
      let values = this.state.currData.seasons;
      values = values.filter((value)=>{
        return typeof value.rainfall !== "string" && value.rainfall !== "NA" && value.rainfall !== NaN && value.rainfall !== undefined;
      });
      return (
        <div id="protograph-div" style={styles}>
          <div className="protograph-card" style={{marginLeft:10,width:"640px",overflow:"visible"}}>
            <div className="protograph-place">{data.data.district}</div>
            <p style={{margin:'10px',marginTop:'0'}}>Annual Rainfall in {years[this.state.currIndex]['year']}</p>
            <div className="protograph-annual" style={{width:"320px"}}>
              <p style={{fontSize:34,fontWeight:'bold'}} className="protograph-annual-average">{this.state.currData.annual_type}</p>
              <div className="protograph-annual-value">
                <span className="protograph-annual-rainfall-value" style={{marginRight:20}}>{this.state.currData.annual} mm </span>
                <span className="protograph-annual-rainfall-percent" style={{color:this.state.currData.annual_dep_perc < 0 ? 'red' : 'black'}}>{Math.abs(this.state.currData.annual_dep_perc)}% below normal</span>
              </div>
            </div>
            <div className="protograph-values" style={{marginTop:30}}>
              <div>
                <div style={{display:"inline-block"}}>
                {
                  values.map((value,index)=>{
                    return(
                      <div style={{width:"120px",textAlign:'center',display:"inline-block"}}>
                        <div style={{color:'#999',fontSize:12,textAlign:'center'}}>{value.season}</div>
                        <img src={"/src/img/"+imgs[index]}/>
                        <div>{value.rainfall}</div>
                        <div style={{position:'relative',marginLeft:-10,color:value.dep_perc <= 0? 'red' : 'black'}}>{value.dep_perc <= 0 ? <i className="caret down icon"></i> : <i className="caret up icon"></i>}{Math.abs(value.dep_perc)}%</div>
                      </div>
                    );
                  })
                }
                </div>
                <div style={{float:'right',bottom:0,position:'absolute',right:40,fontSize:12}}>
                  <div>Rainfall level in mm</div>
                  <div>Above/Below normal</div>
                </div> 
              </div>
            </div>
            <div style={{marginTop:20}} className="protograph-tabs">
              {
                years.map((year,index)=>{
                  return(
                    <div style={{position:'relative',left:0,width:142,margin:0,height:115,borderTop:'1px solid #CCC',zIndex:2,borderRight: index < years.length - 1 ? '1px solid #CCC' : '0px'}} className="protograph-tab">
                      <div style={{marginTop:10}}>
                        <div style={{color:'#999',fontSize:12,textAlign:'center'}}>{year.year}</div>
                        <img src="/src/img/rainfall.png" />
                        <div>{year.annual}</div>
                        <div style={{color:year.annual_dep_perc <= 0 ? 'red' : 'black'}}>
                          {year.annual_dep_perc <= 0 ? <i className="caret down icon"></i> : <i className="caret up icon"></i>}{Math.abs(year.annual_dep_perc).toFixed(0)}%
                        </div>
                        <div onClick={(e)=> this.handleClick(e)} style={{height:"100%",width:"100%",position:'absolute',top:0,zIndex:20}} id={index === years.length -1 ?'protograph_color' : 'protograph_inactive'}></div>
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
        width : "240px"
      }
      let years=[];
      data.data.years.forEach((datum)=>{
        years.push(datum);
      });
      let imgs=['winter.png','rainfall.png','monsoon.png','rainfall.png'];
      let values = this.state.currData.seasons;
      values = values.filter((value)=>{
        return typeof value.rainfall !== "string" && value.rainfall !== "NA" && value.rainfall !== NaN && value.rainfall !== undefined;
      });
      let year=years[years.length-1];
      return (
        <div id="protograph-div" style={styles}>
          <div className="protograph-card" style={{marginLeft:10,width:"240px",overflow:"visible"}}>
            <div style={{marginBottom:10,marginLeft:10}}>
              <div className="protograph-place">{data.data.district}</div>
              <p style={{margin:'10px',marginTop:'0'}}>Annual Rainfall in {years[this.state.currIndex]['year']}</p>
              <div className="protograph-annual" style={{width:"240px"}}>
                <div style={{position:'relative'}}>
                  <p style={{fontSize:34,fontWeight:'bold'}} className="protograph-annual-average">               {this.state.currData.annual_type}
                  </p>
                <img style={{position:'absolute',right:40,top:10}} src="/src/img/rainfall.png" />
                </div>
                <div className="protograph-annual-value">
                  <span className="protograph-annual-rainfall-value" style={{marginRight:20}}>{this.state.currData.annual} mm </span>
                  <span className="protograph-annual-rainfall-percent" style={{color:this.state.currData.annual_dep_perc < 0 ? 'red' : 'black'}}>{Math.abs(this.state.currData.annual_dep_perc)}% below normal</span>
                </div>
              </div>
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
          if(value.average_rainfall > maxDomain)
            maxDomain = value.average_rainfall
          if(value.rainfall < minDomain)
            minDomain = value.rainfall;
          if(value.average_rainfall < minDomain)
            minDomain = value.average_rainfall
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
              <img className="protograph-header-cloud" src="/src/img/cloud-icon.png"/>
            </div>
            <div className="protograph-place">{data.data.district}</div>
            <h3 className="ui header" style={{margin:'0 10px'}}>Rainfall</h3>
            <div className="protograph-values" style={{width:"100%",marginTop:"-10px"}}>
              {
                values.map((value,index)=>{
                  let averageh = minRange + multiplier * (value.average_rainfall - minDomain)
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
                        <div style={{bottom:heights[index]-2,position:"absolute",width:"28px",height:"15px"}}>
                          <img src="/src/img/small-waves.svg" style={{width:"100%"}}/> 
                        </div>                       
                        <div className="protograph-bottle-average" style={{bottom:averageh}}/>
                        <div className="protograph-water" style={{height:heights[index], backgroundColor:"#4A90E2",position:"absolute"}}/>
                        <div className="protograph-svg">
                          <svg width="50px" height="10px">
                            <path d="M12 0 L8 5 H 44 L40 0" fill="transparent" style={{marginTop:"-1px",fill:'#4A90E2'}}/>
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