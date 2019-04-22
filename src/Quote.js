import React, { Component } from 'react';
import './Quote.css';
import Button from 'react-bootstrap/Button';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import axios from 'axios'

//const PORT = process.env.PORT || 4000;  ?????need this???

export default class Quote extends React.Component {
  
  constructor (props){
    super(props)
    this.state={   
      zipcode: '',
      restOfForm: false,
      floorToCeiling: true,
      height: '',
      heightCharge: 1,
      width: '',
      quote: 0,
      finish: 'unfinished',
      finishCharge: 0,
      wood: 'pine',
      woodCharge:'1',
      side: 'plain',
      sideCharge: 0,
      sorry: ''
    }
  }

  handleZipCodeChange = event =>this.setState({zipcode: event.target.value})
  handleZipCodeSubmit = event =>{
    event.preventDefault()
    if (this.state.zipcode > 15000 && this.state.zipcode < 16100){
      this.setState({restOfForm:true})
      this.setState({sorry: ''})
    }else{
      this.setState({restOfForm:false})
      this.setState({sorry: 'Sorry, this is too far of a drive for me. :('})
    }
  }
  handleFloorToCeilingChangeYes = event =>{
    this.setState({
      floorToCeiling: true,
      height: '',
      tempHeight:''
    })
  } 
  handleFloorToCeilingChangeNo = event =>{
    this.setState({
      floorToCeiling: false,
      height:'',
      tempHeight:''
    })}

  handleHeightChange = event => {
    event.preventDefault()
    this.setState({
      height: event.target.value,
      heightCharge : event.target.value > 96 ? 1.15 : 
        event.target.value > 60 ? 1 :
        event.target.value > 48 ? .80 : .70
    })
  }

  updateQuote = event =>{
    //event.preventDefault()
    let woodCharge
    let sideCharge
    let finishCharge
    if(event.target.name === 'wood'){
      let wood = event.target.value
      woodCharge = (wood === 'pine')? 1: //pine no extra, oak/maple/birch *1.1, cherry *1.25
        (wood === 'cherry')? 1.25: 1.10 
      this.setState({ wood })
      this.setState({ woodCharge })
    }else if (event.target.name === 'side'){
      let side = event.target.value
      sideCharge = (side === 'plain')? 0: 500//plain is 0, fancy is +$500
      this.setState({ sideCharge })
      this.setState({ side })
    }else if (event.target.name === 'finish'){
      let finish = event.target.value
      finishCharge = (finish === 'unfinished')? 0: //plain is 0, painted/clear finish is 500, matched stain is 1000 extra.
      (finish === 'match')? 1000: 500 
      this.setState({ finish })
      this.setState({ finishCharge })
    }
    let width = Math.ceil(this.state.width/12)
    let heightCharge = this.state.heightCharge
    let baselinePricePerFoot = 1000
    woodCharge = woodCharge ? woodCharge : this.state.woodCharge
    sideCharge = (sideCharge ===0 || sideCharge ) ? sideCharge : this.state.sideCharge
    finishCharge = (finishCharge ===0 || finishCharge ) ? finishCharge : this.state.finishCharge
    let quote = Math.ceil(heightCharge * width * baselinePricePerFoot * woodCharge + sideCharge + finishCharge)
    this.setState({ quote })
  };

  handleWidthChange = event => {
    event.preventDefault()
    this.setState({width: event.target.value})
  }

  handleEnter = event => {
    if (event.keyCode === 13) {
      const form = event.target.form;
      const index = Array.prototype.indexOf.call(form, event.target);
      if(form.elements.length-1 > index){
        form.elements[index + 1].focus();
      }else{
        this.updateQuote(event)
      }
    }
  }

  submitFinal = (e)=>{
    e.preventDefault();
    const newQuote = {
      zipcode: this.state.zipcode,
      height: this.state.height,
      heightCharge: this.state.heightCharge,
      width: this.state.width,
      quote: this.state.quote,
      finish: this.state.finish,
      finishCharge:this.state.finishCharge,
      wood: this.state.wood,
      woodCharge:this.state.woodCharge,
      side:this.state.side,
      sideCharge:this.state.sideCharge,
    };

  axios.post(`http://${PORT}/quotes/add`, newQuote)
      .then(res => console.log(res.data));
  }
  render(){
    return (
      <div className="container-fluid main">
        <div>
          {!this.state.restOfForm && 
          <form onSubmit={this.handleZipCodeSubmit}>
            <div>
              Enter your zipcode:<span> </span>
              <input className="smallBox" type="text" value={this.state.address} onChange={this.handleZipCodeChange} />
              <input type="submit" value="Submit" />
            </div>
          </form>}
        </div>
        
        {this.state.sorry}

        {this.state.restOfForm && 
        <div>
          <div className="quote">Your (ongoing) quote: ${this.state.quote}</div>     
          <form onSubmit={this.handleAddressSubmit}>
            Will this be a floor-to-ceiling built-in?<span> </span>
            <input  type="radio" 
                    name="yes" 
                    value={this.state.floorToCeiling} 
                    checked={this.state.floorToCeiling===true}
                    onChange={this.handleFloorToCeilingChangeYes} />Yes <span> </span>
            <input  type="radio" 
                    name="no" 
                    value={this.state.floorToCeiling} 
                    checked={this.state.floorToCeiling===false}
                    onChange={this.handleFloorToCeilingChangeNo} />No <span> </span>
          </form>
          
          <form onSubmit={this.updateQuote}>
            {this.state.floorToCeiling ? 
              <span>How tall is the ceiling (in inches)?</span>:
              <span>What will be the height of the structure (in inches)?</span>
            }
            <input className="smallBox" onBlur={this.updateQuote} type="text" value={this.state.height} onChange={this.handleHeightChange} onKeyDown={this.handleEnter} />
            
            <div>What will be the width of the structure (in inches)?
              <input className="smallBox" onBlur={this.updateQuote} type="text" value={this.state.width} onChange={this.handleWidthChange} onKeyDown={this.handleEnter} />
            </div>
            <div>The final product will be:</div>
            <input  type="radio" 
                    name="finish" 
                    value="unfinished" 
                    checked={this.state.finish==="unfinished"}
                    onChange={this.updateQuote} />Unfinished, but ready to paint/stain <span> </span>
            <br></br>
            <input  type="radio" 
                    name="finish" 
                    value="painted" 
                    checked={this.state.finish==="painted"}
                    onChange={this.updateQuote} />Painted <span> </span>
            <br></br>
            <input  type="radio" 
                    name="finish" 
                    value="natural" 
                    checked={this.state.finish==="natural"}
                    onChange={this.updateQuote} />Given a clearcoat finish <span> </span>
            <br></br>
            <input  type="radio" 
                    name="finish" 
                    value="match" 
                    checked={this.state.finish==="stained"}
                    onChange={this.updateQuote} />Stained to match an existing tone<span> </span>

            <div>What kind of wood?</div>
            <input  type="radio" 
                    name="wood" 
                    value="pine" 
                    checked={this.state.wood==="pine"}
                    onChange={this.updateQuote} />Pine <span>  </span>
            <input  type="radio" 
                    name="wood" 
                    value="maple"
                    checked={this.state.wood==="maple"}
                    onChange={this.updateQuote} />Maple/Birch <span>  </span>
            <input  type="radio" 
                    name="wood" 
                    value="oak"
                    checked={this.state.wood==="oak"}
                    onChange={this.updateQuote} />Oak <span>  </span>
            <input  type="radio" 
                    name="wood" 
                    value="cherry"
                    checked={this.state.wood==="cherry"}
                    onChange={this.updateQuote} />Cherry <span>  </span>

            <div>Fancy or plain side? <span> </span>
              <input  type="radio" 
                      name="side" 
                      value="plain" 
                      checked={this.state.side==="plain"}
                      onChange={this.updateQuote} />Plain <span>  </span>
              <input  type="radio" 
                      name="side" 
                      value="fancy" 
                      checked={this.state.side==="fancy"}
                      onChange={this.updateQuote} />Fancy <span>  </span>
              <ButtonToolbar>
                  <OverlayTrigger
                    key="1"
                    placement="bottom"
                    overlay={
                      <Tooltip id={`tooltip-$bottom`}>
                        pics of fancy shizz goes here!
                      </Tooltip>
                    }
                  >
                    <Button className ="tinyI" variant="secondary">i</Button>
                  </OverlayTrigger>
                </ButtonToolbar>
            </div>
          </form>
          <button onClick={this.submitFinal}>submit final</button>
          
        </div>} 
      </div>
    );
  }
}

