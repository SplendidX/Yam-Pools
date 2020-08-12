const fs = require('fs');
var infura = fs.readFileSync(".secret").toString().trim();
var Web3 = require('web3')
var web3 = new Web3(Web3.givenProvider || infura)
const requestify = require('requestify');


const gwei = 1000000000000000000;


const comp = require('./abis/comp.json')
const lend = require('./abis/lend.json')
const link = require('./abis/link.json')
const maker = require('./abis/maker.json')
const snx = require('./abis/snx.json')
const weth = require('./abis/weth.json')
const yfi = require('./abis/yfi.json')

// Contract init

const contracts = {
    1: { abi: comp, address: '0x8538E5910c6F80419CD3170c26073Ff238048c9E', tid: 'compound-governance-token', name: 'comp'},
    2: { abi: lend, address: '0x6009A344C7F993B16EBa2c673fefd2e07f9be5FD', tid: 'ethlend', name: 'lend' },
    3: { abi: link, address: '0xFDC28897A1E32B595f1f4f1D3aE0Df93B1eee452', tid: 'chainlink', name: 'link'},
    4: { abi: maker, address: '0xcFe1E539AcB2D489a651cA011a6eB93d32f97E23', tid: 'maker', name: 'maker'},
    5: { abi: snx, address: '0x6c3FC1FFDb14D92394f40eeC91D9Ce8B807f132D', tid: 'havven', name: 'snx'},
    6: { abi: weth, address: '0x587A07cE5c265A38Dd6d42def1566BA73eeb06F5', tid: 'weth', name: 'weth' },
    7: { abi: yfi, address: '0xc5B6488c7D5BeD173B76Bd5DCA712f45fB9EaEaB', tid: 'yearn-finance', name: 'yfi' },
}


// Pool Balances Output
console.log('****************** YAM Pool Balance ******************')

for (let i=1; i<Object.keys(contracts).length; i++) {
    requestify.get(`https://api.coingecko.com/api/v3/simple/price?ids=${contracts[i]['tid']}&vs_currencies=usd`)
        .then(function (res) {

            var price = JSON.parse(res.body);
            contracts[i]['pool'] = new web3.eth.Contract(contracts[i]['abi'], contracts[i]['address']);
            contracts[i]['pool'].methods.totalSupply().call().then(result => console.log(`${contracts[i]['name'].toUpperCase()} ${(result / gwei)} --- USD: $${price[contracts[i]['tid']]['usd'] * (result/gwei)}`))      
        })
}





