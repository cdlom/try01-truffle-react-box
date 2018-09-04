import React, { Component } from 'react'
import DemoSupplyChainContract from '../build/contracts/DemoSupplyChain.json'
import getWeb3 from './utils/getWeb3'


import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'
import { isNull, isNullOrUndefined } from 'util';

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      storageValue: 0,
      deviceid: 1,
      devicename: '',
      devicereadings: [],
      devicenumberofreadings: 5,
      readingsformatted: [],
      devicelist: [],
      deviceformattedlist: [],
      web3: null,
      contract: null,
    }
    this.instantiateContractRopsten = this.instantiateContractRopsten.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeDevice = this.handleChangeDevice.bind(this);
    this.fetchReadings = this.fetchReadings.bind(this);
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
        console.log(err);
      })
  }

  componentDidMount(){
    this.interval = setInterval(() =>
      this.fetchReadings() , 10000);
    }

  componentWillUnmount(){
    clearInterval(this.interval);
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
      [{
        "constant": false, "inputs": [{ "name": "_deviceId", "type": "uint8" },
        { "name": "_timestamp", "type": "uint256" }, { "name": "_temperature", "type": "uint256" }],
        "name": "addReading", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function"
      },
      {
        "constant": true, "inputs": [{ "name": "_deviceId", "type": "uint8" }, { "name": "_readingNumber", "type": "uint8" }]
        , "name": "getLastNReadingsByDeviceId", "outputs": [{ "name": "", "type": "address[]" }, { "name": "", "type": "uint256[]" },
        { "name": "", "type": "uint256[]" }], "payable": false, "stateMutability": "view", "type": "function"
      },
      { "constant": true, "inputs": [{ "name": "_deviceId", "type": "uint8" }], "name": "getDeviceById", "outputs": [{ "name": "description", "type": "bytes32" }, { "name": "state", "type": "uint8" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "getAllDevices", "outputs": [{ "name": "", "type": "uint8[]" }, { "name": "", "type": "bytes32[]" }, { "name": "", "type": "uint8[]" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_deviceId", "type": "uint8" }, { "name": "_description", "type": "bytes32" }, { "name": "_state", "type": "uint8" }], "name": "addDevice", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }];

    var ropstenaddress = '0x28CA5334B9bef2877d174203495B80f2F5e623b2';

    //var web3 = require('web3');

    var web3 = this.state.web3;

    //const contract = require('truffle-contract')

    //const DemoSupplyChain = contract(DemoSupplyChainContract)

    //DemoSupplyChain.setProvider(this.state.web3.currentProvider)

    var ropDemoSupplyChainContract = web3.eth.contract(abiarray).at(ropstenaddress); //Contract Object

    //guardar el contrato en el stado
    this.setState({ contract: ropDemoSupplyChainContract });

    //console.log("instance");
    //console.log(ropDemoSupplyChainContract);

    //guardar las referencias al metodo
    const _this = this;



    //try 1 - Obtener los detalles de un dispositivo, luego hay que sacarlo de aca

    // ropDemoSupplyChainContract.getDeviceById(1,
    //   function (error, result) {
    //     if (!error) {
    //       console.log(result);
    //       console.log(result[0].toString());

    //       _this.setState({ devicename: result[0].toString() })
    //       console.log(_this.state.devicename);

    //     }
    //     else
    //       console.error(error);
    //   });

    // // Obtener las lecturas de un dispositivo, luego hay que sacarlo de aca
    // ropDemoSupplyChainContract.getLastNReadingsByDeviceId(1, _this.state.devicenumberofreadings,

    //   function (error, result) {
    //     if (!error) {

    //       console.log("readings");
    //       console.log(result);

    //       // Formatear los readings
    //       var _readingsformatted = [];
    //       var dirs = result[0];
    //       var dates = result[1];
    //       var temps = result[2];
    //       for (var i = 0; i < dirs.length; i++) {

    //         _readingsformatted.push(
    //           {
    //             'Address': dirs[i],
    //             'Date': dates[i].toString(),
    //             'Temp': temps[i].toNumber()
    //           }
    //         )

    //       }

    //       _this.setState({
    //         devicereadings: result,
    //         readingsformatted: _readingsformatted

    //       })
    //       console.log(_this.state.devicereadings);
    //       console.log(_readingsformatted);
    //       console.log(_this.state.readingsformatted);

    //     }
    //     else
    //       console.error(error);
    //   });

    //Otener los dispositivos para el select
    ropDemoSupplyChainContract.getAllDevices(

      function (error, result) {
        if (!error) {

          console.log("Dispositivos");
          console.log(result);

          // Formatear los readings
          var _deviceformattedlist = [];
          var _device = result[0];
          var _desc = result[1];
          var _estado = result[2];
          for (var i = 0; i < _device.length; i++) {

            _deviceformattedlist.push(
              {
                'DeviceId': _device[i].toNumber(),
                'Description': web3.toUtf8(_desc[i]),
                'Status': _estado[i].toNumber()
              }
            )

          }

          _this.setState({
            devicelist: result,
            deviceformattedlist: _deviceformattedlist

          })
          console.log("Dispositivos desde el estado");
          console.log(_this.state.devicelist);

          console.log(_this.state.deviceformattedlist);

        }
        else
          console.error(error);
      });
  }


  handleChangeDevice(e) {
    this.setState({ deviceid: e.target.value });
    console.log(this.state.deviceid);
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
    console.log(name, value);
  };

  fetchReadings(e) {
    
    if( !isNullOrUndefined(e))  {
        e.preventDefault(); 
      };

    var ropDemoSupplyChainContract = this.state.contract;

    const _this = this;

    // Obtener las lecturas de un dispositivo, luego hay que sacarlo de aca
    ropDemoSupplyChainContract.getLastNReadingsByDeviceId(_this.state.deviceid, _this.state.devicenumberofreadings,

      function (error, result) {
        if (!error) {

          console.log("readings");
          console.log(result);

          // Formatear los readings
          var _readingsformatted = [];
          var dirs = result[0];
          var dates = result[1];
          var temps = result[2];
          for (var i = 0; i < dirs.length; i++) {


            ///transformar fecha y hora
            const fechahora = new Date(Number(dates[i].toString()));
            const fecha = fechahora.getDate() + '/' + (fechahora.getMonth() + 1) + '/' + fechahora.getFullYear();
            const hora = fechahora.getHours() + ':' + fechahora.getMinutes();
            const temperatura = temps[i].toString() + '°C';

            _readingsformatted.push(
              {
                'Address': dirs[i],
                'Date': fecha,
                'Hora': hora,
                'Temp': temperatura
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
  };

  render() {
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
          <a href="#" className="pure-menu-heading pure-menu-link">NEORIS</a>
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-4-5">
              <h1>Blockchain - IoT DEMO</h1>
              <div className="row">
                < form className="pure-form" onSubmit={this.fetchReadings}>
                  <legend>Parámetros de selección</legend>
                  <fieldset>
                    <div className="pure-u-2-5">

                      <label htmlFor="device">Dispositivo: </label>
                      <select id="device" onChange={this.handleChangeDevice} value={this.state.deviceid}>
                        {
                          this.state.deviceformattedlist.map((item, itemindex) => (
                            <option key={itemindex} value={item.DeviceId}>{item.Description}</option>

                          ))
                        }
                      </select>
                    </div>
                    <div className="pure-u-2-5">
                      <label htmlFor="numberofreadings"> Número de lecturas: </label>
                      <input id="numberofreadings" name="devicenumberofreadings" type="number" value={this.state.devicenumberofreadings} onChange={this.handleChange} />
                    </div>
                    <div className="pure-u-1-5">
                      <button className="pure-button pure-button-primary">Consultar</button>
                    </div>
                  </fieldset>


                </ form>
                <div className = "pure-g">
                <div className="row">
                  <div className="pure-u-1-1">
                    <table className="pure-table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Sender</th>
                          <th>Fecha</th>
                          <th>Hora</th>
                          <th>Temperatura</th>
                        </tr>
                      </thead>



                      {
                        this.state.readingsformatted.map((item, itemindex) => (
                          <tbody>
                            <tr className="pure-table-odd">
                              <th> {itemindex} </th>
                              <th> {item.Address} </th>
                              <th> {item.Date} </th>
                              <th> {item.Hora} </th>
                              <th> {item.Temp} </th>
                            </tr>

                          </tbody>

                        ))
                      }



                    </table>
                  </div>
                </div>
              </div>

                      </div>


              {/* <p>Your Truffle Box is installed and ready.</p>
              <h2>Smart Contract Example Ropsten Actualiza era eso?, Sigue? </h2>
              <p>If your contracts compiled and migrated successfully, below will show a stored value of 5 (by default).</p>
              <p>Try changing the value stored on <strong>line 59</strong> of App.js.</p> 
              <p>El nombre del dispositivo 1 es: {this.state.devicename}</p>
              <p>Las ultimas 5 escrituras son: </p>
              <ul className="pure-menu-list">
                 {this.state.readingsformatted.map((item, itemIndex) => (
                <li className="pure-menu-item" key={itemIndex}>
                   / Escritura-->={itemIndex} 
                   / Address-> ={item.Address}
                   / Fecha-> ={item.Date}
                   / Temperatura-> ={item.Temp} 
                </li>
                ))
                } 
                                
                
              </ul>*/}

            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App
