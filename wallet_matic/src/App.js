import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Wallet from './artifacts/contracts/Wallet.sol/Wallet.json';
import './App.css';

const WalletAddress = process.env.REACT_APP_CONTRACT_ADDRESS

function App() {

  const [account, setAccount] = useState('')
  const [balance, setBalance] = useState(0);
  const [amountSend, setAmountSend] = useState();
  const [amountWithdraw, setAmountWithdraw] = useState();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    connectHandler();
    getBalance();
  }, [balance])

  const connectHandler = async () => {
    if(typeof window.ethereum !== 'undefined') {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const account = ethers.utils.getAddress(accounts[0])
    setAccount(account);
    }
  }

    async function getBalance() {
      if(typeof window.ethereum !== 'undefined') { 
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(WalletAddress, Wallet.abi, provider);
        try {
          const overrides = {
            from: account 
          }
          const data = await contract.getBalance(overrides); 
          setBalance(String(data));
        }
        catch(err) {
          setError('Une erreur est survenue.');
        }
      }
    }

    async function transfer() {
      if(!amountSend) {
        return;
      }
      setError('');
      setSuccess('');
      if(typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum); 
        const signer = provider.getSigner(); 
        try {
          const tx = {
            from: account,
            to: WalletAddress,
            value: ethers.utils.parseEther(amountSend)
          }
          const transaction = await signer.sendTransaction(tx);
          await transaction.wait();
          setAmountSend('');
          getBalance();
          setSuccess('Vos Matic ont bien été transféré dans votre Wallet ! ')
        }
        catch(err) {
          setError('Une erreur est survenue.');
        }
      }
  }

  async function withdraw() {
    if(!amountWithdraw) {
      return;
    }
    setError('');
    setSuccess('');
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(WalletAddress, Wallet.abi, signer);
    try {
      const transaction = await contract.withdraw(account, ethers.utils.parseEther(amountWithdraw));
      await transaction.wait();
      setAmountWithdraw('');
      getBalance();
      setSuccess('Vos Matic ont bien été retiré du Wallet ! ');
    }
    catch(err) {
      setError('Une erreur est survenue.');
    }
  }

    function changeAmountSend(e) {
      setAmountSend(e.target.value); 
    }
  
    function changeAmountWithdraw(e) {
      setAmountWithdraw(e.target.value);
    }

  return (
    <div className="App">
      <nav className="navbar">
        <img className='logo' src='/walletPolygon.png' />
        <img className='' src='/polygon.png' alt=""  height="80" />
          <div>
              {account ? ( 
                <button type="button" className='nav-connect'>
                    {account.slice(0, 6) + '...' + account.slice(38, 42)}
                </button>
              ) : ( 
                <button type="button" className='nav-connect' onClick={connectHandler}>
                    Connexion
                </button>
            )}
          </div>
      </nav>
      <div className="container">
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <h2>{balance / 10**18} <span className="matic">MATIC DISPONIBLE</span></h2>
        <div className="wallet"> 
              <h3>Envoyer du matic</h3>
              <input type="text" placeholder="Montant en Matic" onChange={changeAmountSend} />
              <button className="btn envoyer" onClick={transfer}>Envoyer</button>
              <h3>Retirer du matic</h3>
              <input type="text" placeholder="Montant en Matic" onChange={changeAmountWithdraw} />
              <button className="btn retirer" onClick={withdraw}>Retirer</button>
          </div>
      </div>
    </div>
  );
}

export default App;
