import React, { Component } from 'react'
import DemoSupplyChainContract from '../build/contracts/DemoSupplyChain.json'
import getWeb3 from './utils/getWeb3'


import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      storageValue: 0,
      deviceid: 0,
      devicename:'',
      devicereadings: [],
      devicenumberofreadings: 5,
      readingsformatted:[],
      web3: null
    }
    this.instantiateContractRopsten = this.instantiateContractRopsten.bind(this);
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })

      // Instantiate contract once web3 provided.
     //this.instantiateContract()

     //Inicializar desde la Ropsten con el ABi
     this.instantiateContractRopsten()
    })
    .catch((err) => {
      console.log('Error finding web3.');
      console.log (err);
    })
  }

  instantiateContract() {
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */

    const contract = require('truffle-contract')
    // const simpleStorage = contract(SimpleStorageContract)
    // simpleStorage.setProvider(this.state.web3.currentProvider)
    const DemoSupplyChain = contract(DemoSupplyChainContract)
    DemoSupplyChain.setProvider(this.state.web3.currentProvider)

    console.log(DemoSupplyChain);

    // Declaring this for later so we can chain functions on SimpleStorage.
    //var simpleStorageInstance
    var DemoSupplyChainInstance

    // Get accounts.
   // this.state.web3.eth.getAccounts((error, accounts) => {
      DemoSupplyChain.deployed().then((instance) => {
        DemoSupplyChainInstance = instance

        console.log("instance");
        console.log(instance);

        // Stores a given value, 5 by default.
        //return simpleStorageInstance.set(5, {from: accounts[0]})
        return instance.getDeviceById(1);
      //}).then((result) => {
        // Get the value from the contract to prove it worked.
        //return simpleStorageInstance.get.call(accounts[0])
      }).then((result) => {



        console.log("result");
        console.log(result);
        // // Update state with the result.
        return this.setState({ 
           devicename: result[0].toString(),

          })
      })
  //  })
  }


  instantiateContractRopsten() {
    
    console.log("entra en ropsten");

    var abiarray = 
      [{"constant":false,"inputs":[{"name":"_deviceId","type":"uint8"},
      {"name":"_timestamp","type":"uint256"},{"name":"_temperature","type":"uint256"}],
      "name":"addReading","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},
      {"constant":true,"inputs":[{"name":"_deviceId","type":"uint8"},{"name":"_readingNumber","type":"uint8"}]
      ,"name":"getLastNReadingsByDeviceId","outputs":[{"name":"","type":"address[]"},{"name":"","type":"uint256[]"},
      {"name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},
      {"constant":true,"inputs":[{"name":"_deviceId","type":"uint8"}],"name":"getDeviceById","outputs":[{"name":"description","type":"bytes32"},{"name":"state","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getAllDevices","outputs":[{"name":"","type":"uint8[]"},{"name":"","type":"bytes32[]"},{"name":"","type":"uint8[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_deviceId","type":"uint8"},{"name":"_description","type":"bytes32"},{"name":"_state","type":"uint8"}],"name":"addDevice","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}];

    var ropstenaddress = '0x28CA5334B9bef2877d174203495B80f2F5e623b2';

    //var web3 = require('web3');

    var web3 = this.state.web3;

    //const contract = require('truffle-contract')
   
    //const DemoSupplyChain = contract(DemoSupplyChainContract)
    
    //DemoSupplyChain.setProvider(this.state.web3.currentProvider)

    var ropDemoSupplyChainContract =  web3.eth.contract(abiarray).at(ropstenaddress); //Contract Object


    //console.log(DemoSupplyChain);

    // Declaring this for later so we can chain functions on SimpleStorage.
    //var simpleStorageInstance
    //var ropDemoSupplyChainInstance =    ropDemoSupplyChainContract.at(ropstenaddress);

    console.log("instance");
    console.log (ropDemoSupplyChainContract);

    //try 1
 //var device  
    const _this = this;
    ropDemoSupplyChainContract.getDeviceById(1, 
      function (error,result){
        if(!error){
          console.log(result);
      //    return this.setState({ 
      //      devicename: result[0].toString() })
       //   device = result;
            console.log(result[0].toString());

            _this.setState({  devicename: result[0].toString() }) 
            console.log(_this.state.devicename);

      }
        else 
          console.error(error);
      });


      ropDemoSupplyChainContract.getLastNReadingsByDeviceId(1,_this.state.devicenumberofreadings,
      
        function (error,result){
          if(!error){

            console.log("readings");
            console.log(result);
        //    return this.setState({ 
        //      devicename: result[0].toString() })
         //   device = result;
         //     console.log(result[0].toString());
  
              

               // Formatear los readings
               var _readingsformatted = [];
               var dirs = result[0];
               var dates = result[1];
               var temps = result[2];
               for(var i=0; i < dirs.length ; i++) {

                
                  _readingsformatted.push(
                      {
                        'Address':dirs[i],
                        'Date':dates[i].toString(),
                        'Temp': temps[i].toNumber()
                      }
                  )

               }

               _this.setState({  
                devicereadings: result,
                readingsformatted: _readingsformatted
                
               }) 
              console.log(_this.state.devicereadings);
              console.log(_readingsformatted);
              console.log(_this.state.readingsformatted);

              
  
        }
          else 
            console.error(error);
        });

      



      
   //   this.setState({  devicename: device[0].toString() }) 

     /*  // try 2
      ropDemoSupplyChainContract.getDeviceById(1).call().then(function(v) {
          console.log(v);


      });
 */
      


    //console.log("device");
    //console.log (ropDemoSupplyChainInstance.methods.getDeviceById(1).call());

    // ropDemoSupplyChainContract.methods.getDeviceById(1).call( 
    //  function (err , result)  {

    //      console.log("result");
    //      console.log(result);

    //      console.log("error");
    //      console.log(err);
    //      // Update state with the result.
    //     return this.setState({ 
    //         devicename: result[0].toString(),
 
    //   })
      
    // });

    // Get accounts.
   // this.state.web3.eth.getAccounts((error, accounts) => {
   //   DemoSupplyChain.deployed().then((instance) => {
   //     DemoSupplyChainInstance = instance

   //     console.log("instance");
   //     console.log(instance);

        // Stores a given value, 5 by default.
        //return simpleStorageInstance.set(5, {from: accounts[0]})
    //    return instance.getDeviceById(1);
      //}).then((result) => {
        // Get the value from the contract to prove it worked.
        //return simpleStorageInstance.get.call(accounts[0])
     // }).then((result) => {



     //   console.log("result");
     //   console.log(result);
        // // Update state with the result.
      //  return this.setState({ 
      //     devicename: result[0].toString(),

      //    })
     // })
  //  })
  }

  render() {
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
            <a href="#" className="pure-menu-heading pure-menu-link">Truffle Box</a>
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h1>Good to Go!</h1>
              <p>Your Truffle Box is installed and ready.</p>
              <h2>Smart Contract Example</h2>
              {/* <p>If your contracts compiled and migrated successfully, below will show a stored value of 5 (by default).</p>
              <p>Try changing the value stored on <strong>line 59</strong> of App.js.</p> */}
              <p>El nombre del dispositivo 1 es: {this.state.devicename}</p>
              <p>Las ultimas 5 escrituras son: </p>
              <ul>
                 {this.state.readingsformatted.map((item, itemIndex) => (
                <li key={itemIndex}>
                   / Escritura-->={itemIndex} 
                   / Address-> ={item.Address}
                   / Fecha-> ={item.Date}
                   / Temperatura-> ={item.Temp} 
                </li>
                ))
                } 
                                
                
              </ul>
                  
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App
