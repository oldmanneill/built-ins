import React from 'react';
//import './Quote.css';
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';

export default class ShowMain extends React.Component {
  
  constructor (props){
    super(props)
    this.state={   
      someFiller: '',
    }
  }
  render() {
    return (
      <div>
        this is the main page!!!
      </div>
    );
  }
}