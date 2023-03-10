const Web3 = require('web3');
const fs = require('fs');


const web3 = new Web3(new Web3.providers.HttpProvider('https://testnet-msc.mindchain.info/'));


const privateKey = '0xd6a821b919c8c6f30619111d422ad6ea42502175722d131efccc13e8c8635da8';
const myAddress = '0x94318E7F06946c0a81e126DB9923f7497992a034';


const transfers = readTransfersFromFile('t.txt');


const gasPrice = '500';

async function bulkTransfer() {
 
  let nonce = await web3.eth.getTransactionCount(myAddress);


  for (const transfer of transfers) {
    const txObject = {
      nonce: nonce,
      to: transfer.to,
      value: web3.utils.toWei(transfer.amount),
      gas: 21000,
      gasPrice: web3.utils.toWei(gasPrice, 'gwei')
    };

    let signedTx = await web3.eth.accounts.signTransaction(txObject, privateKey);

    web3.eth.sendSignedTransaction(signedTx.rawTransaction, function(error, result) {
      if (error) {
        console.log(error);
      } else {
        console.log(`Sent ${transfer.amount} MIND to ${transfer.to}`);
      }
    });

    nonce++;
  }
}

function readTransfersFromFile(filename) {
  const fileContents = fs.readFileSync(filename, 'utf-8');
  const lines = fileContents.trim().split('\n');
  console.log(`File contents: ${fileContents}\n`);
  console.log(`Found ${lines.length} lines\n`);

  return lines.map(line => {
    const [to, amount] = line.trim().split(',');
    return { to, amount };
  });
}

bulkTransfer();
