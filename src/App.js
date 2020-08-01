import React from 'react';
import Bank from './Bank';
import './App.css';

class DrumPad extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			isPlaying: false
		};
		this.handleChange = this.handleChange.bind(this);
	}
	
	componentDidMount(){
		document.addEventListener('keydown', (e) => { this.handleKeyPress(e) });
	}
	
	componentWillUnmount() {
	    document.removeEventListener('keydown', this.handleKeyPress);
	}
	
	activatePad(element){
		element.style.backgroundColor = '#FFF';
		element.style.color = '#000';
		setTimeout(() => { 
			element.style.backgroundColor = '#A09CB0';
			element.style.color = '#2e2f3e';
		}, 10);
	}
	
	handleChange(e){
		e.preventDefault();
		const div = e.target;
		if(this.props.power){
			const audio = div.querySelector('audio');
			
			const playPromise = audio.play();
			if(playPromise !== undefined){
				playPromise.then(_ => {
					this.activatePad(div);
				}).catch(error => {
				});
			}
			
			this.props.onChangeDisplay(div.id.replace(/-/g, ' '));
		}
	}
	
	handleKeyPress(e){
		e.preventDefault();
		const data = this.props.bank.filter((b) => e.keyCode === b.keyCode);
		if(data !== undefined && data.length > 0){
			const div = document.querySelector(`div#${data[0].id}`);
			div.click();
		}
	}
	
	render(){
		const banks = this.props.bank.map((b) => {
			return (
					<div id={b.id} className="drum-pad" key={b.keyCode} onClick={this.handleChange}>
						<audio id={b.keyTrigger} className="clip" src={b.url}></audio>
						{b.keyTrigger}
					</div>
			);
		});
		
		return (
			<div className="Pads">
				{banks}
			</div>
		);
	}
}

class App extends React.Component {
	  constructor(props){
		  super(props);
		  this.state = { 
		    display: '', 
			bank: Bank.one,
			power: true
		  };
		  this.handleDisplay = this.handleDisplay.bind(this);
		  this.powerOn = this.powerOn.bind(this);
		  this.changeBank = this.changeBank.bind(this);
		  this.disableBank = this.disableBank.bind(this);
	  }
	  
	  handleDisplay(disp){
		  this.setState({ display: disp });
	  }
	  
	  powerOn(event){
		  this.setState({
			  power: !this.state.power,
			  display: (this.state.power) ? 'Power Off': 'Power On'
		  });
		  setTimeout(() => {
			  this.setState({ display: '' });
		  }, 1000);
	  }
	  
	  changeBank(e){
		  if(this.state.power){
			  if(e.target.checked){
				  this.setState({
					  bank: Bank.two,
					  display: 'Smooth Piano Kit'
				  });
			  }else{
				  this.setState({
					  bank: Bank.one,
					  display: 'Heater Kit'
				  });
			  }
		  }
	  }
	  
	  disableBank(){
		  if(this.state.power){
			  return '#2D2D2D';
		  }
		  
		  return '#CCC';
	  }
	
	  render(){
		  const color = this.disableBank();
		  return (
			<div id="drum-machine">
				<div id="display"><span>{this.state.display}</span></div>

				<DrumPad bank={ this.state.bank } onChangeDisplay={this.handleDisplay} power={ this.state.power } />
				
				<div className="buttons">
				    <label className="switch">
					  <input type="checkbox" onChange={this.changeBank} disabled={ (this.state.power) ? false : true } />
					  <span className="slider bank" style={{ backgroundColor: color }}></span>
					</label>
					<label className="switch">
					  <input type="checkbox" onChange={this.powerOn} checked={ (this.state.power) ? true : false } />
					  <span className="slider round"></span>
					</label>
				</div>
			</div>
		  );
	  }
}

export default App;
