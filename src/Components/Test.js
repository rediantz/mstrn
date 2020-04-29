import React, { Component } from 'react';
import {Enc, Dec} from './Config/EncDec';
class Test extends Component {
  constructor(props) {
    super(props);
    this.state = {
      str : "kepadaku"
    }
  }
  iseng(){
    let enc = Enc(this.state.str);
    let dec = Dec(enc);
    return(
      <>
        {enc}
        <br/>
        {dec}
      </>
    )
  }
  render() { 
    return (
      <>
        {this.iseng()}
      </>
    );
  }
}
 
export default Test;