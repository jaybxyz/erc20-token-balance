window.addEventListener('load', function () {
    if (typeof web3 !== 'undefined') {
        console.log('Web3 Detected! ' + web3.currentProvider.constructor.name)
        window.web3 = new Web3(web3.currentProvider);
    } else {
        console.log('No Web3 Detected... using HTTP Provider')
        window.web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/<YOUR APIKEY GOES HERE>"));
    }
})

const promisify = (inner) =>
    new Promise((resolve, reject) =>
        inner((err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        })
    );

async function getBalance() {
    var address, wei, balance
    address = document.getElementById("address").value;
    wei = promisify(cb => web3.eth.getBalance(address, cb))
    try {
        balance = web3.fromWei(await wei, 'ether')
        document.getElementById("output").innerHTML = balance + " ETH";
    } catch (error) {
        document.getElementById("output").innerHTML = error;
    }
}

async function getERC20Balance() {
    var address, contractAddress, contractABI, tokenContract, decimals, balance, name, symbol, adjustedBalance
    address = document.getElementById("address").value
    contractAddress = document.getElementById("contractAddress").value
    contractABI = human_standard_token_abi

    tokenContract = web3.eth.contract(contractABI).at(contractAddress)

    decimals = promisify(cb => tokenContract.decimals(cb))
    balance = promisify(cb => tokenContract.balanceOf(address, cb))
    name = promisify(cb => tokenContract.name(cb))
    symbol = promisify(cb => tokenContract.symbol(cb))

    //var balance = Math.round((tokenContract.balanceOf(address).toString(10) / Math.pow(10, 18))).toFixed(18)

    try {
        adjustedBalance = Math.round(await balance / Math.pow(10, await decimals)).toFixed(18)
        document.getElementById("output2").innerHTML = adjustedBalance;
        document.getElementById("output2").innerHTML += " " + await symbol + " (" + await name + ")";
    } catch (error) {
        document.getElementById("output2").innerHTML = error;
    }
}