
// Imports:
import { sAXIALABI, veAXIALABI } from '$lib/abis';
import { multicallOneContractQuery, parseBN } from 'weaverfi/dist/functions.js';
import weaver from 'weaverfi';

// Type Imports:
import type { Address, CallContext } from 'weaverfi/dist/types';

// Initializations:
const sAXIAL: Address = '0xed7f93C8FD3B96B53c924F601B3948175D2820D8';
const veAXIAL: Address = '0x3f563F7efc6dC55adFc1B64BC6Bd4bC5F394c4b2';
const decimals = 18;

/* ========================================================================================================================================================================= */

// Function to fetch sAXIAL balances:
export const fetchSAXIALBalances = async () => {

  // Initializations:
  let balances: { wallet: Address, balance: number }[] = [];

  console.log(weaver);

  // Fetching Users:
  let users: Address[] = await weaver.avax.query(sAXIAL, sAXIALABI, 'getAllUsers', []);

  // sAXIAL Balance Multicall:
  let balanceCalls: CallContext[] = [];
  users.forEach(user => {
    balanceCalls.push({ reference: user.toLowerCase(), methodName: 'getBalance', methodParameters: [user] });
  });
  let balanceResults = await multicallOneContractQuery('avax', sAXIAL, sAXIALABI, balanceCalls);
  for(let stringWallet in balanceResults) {
    let balance = parseBN(balanceResults[stringWallet][0]) / (10 ** decimals);
    if(balance > 0) {
      let wallet = stringWallet as Address;
      balances.push({ wallet, balance });
    }
  }

  return balances.sort((a, b) => b.balance - a.balance);
}

// Function to fetch veAXIAL balances:
export const fetchVeAXIALBalances = async () => {

  // Initializations:
  let balances: { wallet: Address, accrued: number, staked: number }[] = [];

  // Fetching Users:
  let users: Address[] = await weaver.avax.query(veAXIAL, veAXIALABI, 'getAllUsers', []);

  // veAXIAL Accrued Multicall:
  let accruedCalls: CallContext[] = [];
  users.forEach(user => {
    accruedCalls.push({ reference: user.toLowerCase(), methodName: 'getAccrued', methodParameters: [user] });
  });
  let accruedResults = await multicallOneContractQuery('avax', veAXIAL, veAXIALABI, accruedCalls);
  for(let stringWallet in accruedResults) {
    let accrued = parseBN(accruedResults[stringWallet][0]) / (10 ** decimals);
    if(accrued > 0) {
      let wallet = stringWallet as Address;
      balances.push({ wallet, accrued, staked: 0 });
    }
  }

  // veAXIAL Staked Multicall:
  let stakedCalls: CallContext[] = [];
  balances.forEach(entry => {
    stakedCalls.push({ reference: entry.wallet.toLowerCase(), methodName: 'getStaked', methodParameters: [entry.wallet] });
  });
  let stakedResults = await multicallOneContractQuery('avax', veAXIAL, veAXIALABI, stakedCalls);
  for(let stringWallet in stakedResults) {
    let staked = parseBN(stakedResults[stringWallet][0]) / (10 ** decimals);
    if(staked > 0) {
      let wallet = stringWallet as Address;
      let index = balances.findIndex(entry => entry.wallet === wallet);
      if(index !== -1) {
        balances[index].staked = staked;
      }
    }
  }

  return balances.sort((a, b) => b.accrued - a.accrued);
}