const Web3 = require('web3');
const fs = require('fs');

const web3 = new Web3(new Web3.providers.HttpProvider('https://testnet-msc.mindchain.info/'));

const privateKey = 'DROP YOUR PRIVATE KEY';
const myAddress = 'DROP THE YOUR ADRESS';

const transfers = readTransfersFromFile('t.txt');

const gasPrice = '500';

async function bulkTransfer() {
 
  let nonce = await web3.eth.getTransactionCount(myAddress);

  for (const transfer of transfers) {
    const amount = transfer.amount || '0';
    const txObject = {
      nonce: nonce,
      to: transfer.to,
      value: web3.utils.toWei(amount.toString()),
      gas: 21000,
      gasPrice: web3.utils.toWei(gasPrice, 'gwei')
    };

    let signedTx = await web3.eth.accounts.signTransaction(txObject, privateKey);

    web3.eth.sendSignedTransaction(signedTx.rawTransaction, function(error, result) {
      if (error) {
        console.log(error);
      } else {
        console.log(`Sent ${amount} MIND to ${transfer.to}`);
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

  return lines.map((line, index) => {
    const [to, amount] = line.trim().split(',');
    if (!to || !amount) {
      console.log(`Skipping invalid line ${index + 1}: ${line}`);
      return null;
    }
    return { to, amount };
  }).filter(Boolean);
}

bulkTransfer();

