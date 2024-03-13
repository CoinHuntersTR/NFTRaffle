import { useState, useEffect } from 'react'
import './App.css'
import './css/style.css'
import Connect from './controllers/Connect';
import Buyers from './components/Buyers';
import {Contract} from './contracts/Contract';
import { ethers } from "ethers";
import { NFTContract } from './contracts/NFTContract';
import RaffleNFT from './images/RaffleNFT.jpg'
import bayc from './images/bayc.png'
import bayc2 from './images/bayc2.jpg'
import cpunks from './images/cpunks.png'
import cpunks2 from './images/cpunks2.png'
import beanz from './images/beanz.png'
import DeGods from './images/DeGods.png'
import Doodles from './images/Doodles.png'
import milady from './images/milady.png'

function App() {

  const [first, setfirst] = useState(false)
  const [raffleContract, setRaffleContract] = useState(null)
  const [nftContract, setNftContract] = useState(null)
  const [account, setAccount] = useState(null)
  const [entries, setEntries] = useState(null)
  const [lottery, setLottery] = useState(false)
  const [buyers, setBuyers] = useState([])
  const [userTickets, setUserTickets] = useState(null)
  const [ticketCost, setTicketCost] = useState(null)
  const [ticketValue, setTicketValue] = useState(1)
  const [ticketMax, setTicketMax] = useState(1)
  const [walletAddress, setWalletAddress] = useState("")
  const [winnerAddress, setWinnerAddress] = useState(null)
  const [nftAddress, setNftAddress] = useState("0x0000000000000000000000000000000000000000")
  const [nftID, setNFTID] = useState(null)
  const [admin, setAdmin] = useState(null)
  const [showNFTID, setShowNFTIF] = useState(0)
  const [raffleNFTAddress, setRaffleNFTAddress] = useState("")
  const [raffleNFTID, setRaffleNFTID] = useState("")

  const newAccount = (provider) => {
    const contract = Contract();
    const nftContract = NFTContract();
    setRaffleContract(contract);
    setNftContract(nftContract);
    setAccount(provider);
    setfirst(true)
  }

  const handleWalletAddress = (walletAddress) => {
    setWalletAddress(walletAddress)
  }

  const showTicketCost = async () => {
    const response = await raffleContract?.ticketCost();
    const responseValue = await ethers.utils.formatEther(response)
    setTicketCost(responseValue);
  }

  const showMaxTicket = async () => {
    const response = await raffleContract?.maxTicket();
    const responseValue = await ethers.utils.formatEther(response)
    const maxTicketValue = await responseValue * 10**18;
    setTicketMax(maxTicketValue);
  } 

  const showEntries = async () => {
    const response = await raffleContract?.totalEntries();
    const responseValue = await ethers.utils.formatEther(response)
    const entriesValue = await Math.round(responseValue * 10**18)
    setEntries(entriesValue);
  }

  const showBuyers = async () => {
    const response = await raffleContract?.getPlayers();
    setBuyers(response);
  }

  const showLotteryStatus = async () => {
    const response = await raffleContract?.lotteryStatus();
    setLottery(response);
  }

  const showUserTicket = async () => {
    const signer = await account.getSigner();
    const ticketCount = await raffleContract?.entryCounts(signer.getAddress());
    const responseValue = await ethers.utils.formatEther(ticketCount)
    const ticketValue = await responseValue * 10**18
    setUserTickets(ticketValue);
  }

  const showWinner = async () => {
    const response = await raffleContract?.winnerAddress();
    if (response != "0x0000000000000000000000000000000000000000") {
      setWinnerAddress(response)
    }
  }

  const showNftAddress = async () => {
    const response = await raffleContract?.nftContract();
    setNftAddress(response)
  }

  const showNFTId = async () => {
    const response = await raffleContract?.tokenId();
    const responseValue = await ethers.utils.formatEther(response)
    const nftValue = await Math.round(responseValue * 10**18)
    setNFTID(nftValue)
  }

  const showAdminAddress = async () => {
    const response = await raffleContract?.admin();
    setAdmin(response)
  } 

  const handleTicketValue = (event) => {
    setTicketValue(event.target.value)
  }

  const handleTicketDecrease = () => {
    if (ticketValue > 1) {
      setTicketValue(ticketValue - 1)
    }
  }

  const handleTicketIncrease = () => {
    if (ticketValue < ticketMax) {
      setTicketValue(ticketValue + 1)
    }
  }

  const handleBuyTicket = async () => {

    const signer = await account.getSigner();
    const userTicketCount = await raffleContract?.entryCounts(signer.getAddress());
    const userTicketCountValue = await ethers.utils.formatEther(userTicketCount)
    const userTicketCountValueA = await userTicketCountValue * 10**18
    const ticketMaxValue = await ticketMax;
    const buyCount = await Math.floor(userTicketCountValueA + ticketValue)

    if ((buyCount < ticketMaxValue) || (buyCount == ticketMaxValue)) {
      let value_ = await ethers.utils.parseEther(`${ticketCost * ticketValue}`)
      try {
        const txn = await raffleContract.buyTicket(ticketValue, { value: value_ });
        await txn.wait();
        await console.log("success")
      } catch(error) {
        if ((error.code === "INSUFFICIENT_FUNDS") || (error.code === -32603) || (error.code === -32000)) {
          window.alert("You Don't Have Enough Money")
        }
      }
    } else {
        window.alert("You can't buy that many tickets!")
    }
  }

  const mintNFT = async () => {
    console.log(admin)
    const txn = await nftContract.safeMint(admin);
    await txn.wait();
    console.log(txn)
  }

  const showNFTOwner = async (event) => {
    event.preventDefault();
    const nftNumber = await showNFTID
    await console.log(nftNumber)
    const response = await nftContract.ownerOf(nftNumber);
    await console.log(response)
  }

  const beginRaffle = async (event) => {
    event.preventDefault();
    const NFT = await raffleNFTAddress;
    const nftID = await raffleNFTID;
    console.log(NFT, nftID)
    const txn = await raffleContract.startLottery(NFT, nftID);
    await txn.wait();
    console.log(txn)
  }

  const handleEndRaffle = async () => {
    const txn = await raffleContract.endLottery();
    await txn.wait();
    console.log(txn)
  }

  const handlePickWinner = async () => {
    const txn = await raffleContract.pickWinner();
    await txn.wait();
    console.log(txn)
  }

  const handleRaffleNFT = (e) => {
    setRaffleNFTAddress(e.target.value)
  }

  const handleRaffleNFTID = (e) => {
    setRaffleNFTID(e.target.value)
  }

  const handleNFTID = (e) => {
    setShowNFTIF(e.target.value)
  }

  useEffect(() => {
    if (account) {
      showUserTicket();
      showBuyers();
      showTicketCost();
      showEntries();
      showLotteryStatus();
      showWinner();
      showNftAddress();
      showAdminAddress();
      showMaxTicket();
      showNFTId();
    }    
  });

  return (
    <>
      <Connect sendProvider={newAccount} sendWallet={handleWalletAddress}/>
      {/* <ShowWinner show={raffleContract} /> */}
      {first ? 
        <div className='w-full flex flex-col'>
          <div className='flex flex-col lg:flex-row mb-10 pb-10 border-b-2'>
            <div className='lg:w-1/2 items-center px-4'>
              <h2 className='ml-10 mt-10 text-3xl font-bold tracking-wider border-b-2'>Current Prize NFT</h2>
              <div className='m-10 flex items-center justify-center drop-shadow-xl'>
                <img className='rounded-lg drop-shadow-xl' src={RaffleNFT} alt="" />
              </div>
              <div>
                <h4 className="tracking-wider font-semibold text-xl underline">NFT Info:</h4>
                <div className='flex flex-row space-x-2 my-3'>
                  <div className='flex flex-row space-x-2'>
                    <p className='font-bold tracking-wider'>Collection:</p>
                    <p>Taiko Bulls</p>
                  </div>
                  <div className='flex flex-row space-x-2'>
                    <p className='font-bold tracking-wider'>Number:</p>
                    <p>#{nftID}</p>
                  </div>
                </div>
                <div className="mt-2 flex flex-row space-x-2">
                  <input className='px-4 border-2 border-gray-400' value={nftAddress} type="text" disabled/>
                  <button onClick={() =>  navigator.clipboard.writeText(`${nftAddress}`)}>
                      Copy NFT Address
                  </button>
                </div>
              </div>
            </div>
            <div className='lg:w-1/2 items-center px-4'>
              <div className='m-10'>
                <div className='mt-20 mb-10'>
                    {
                    lottery ? 
                    <div className='mx-12 py-4 border-4 rounded-xl border-green-600 bg-green-300 text-center flex flex-row space-x-2 items-center justify-center'>
                      <p className='font-bold text-xl'>Lottery Status: </p>
                      <p className='font-bold text-2xl'>OPEN</p>
                    </div>
                    : 
                    <div className='mx-12 py-4 border-4 rounded-xl border-red-800 bg-red-500 text-center flex flex-row space-x-2 items-center justify-center'>
                      <p className='font-bold text-xl'>Lottery Status: </p>
                      <p className='font-bold text-2xl'>CLOSE</p>
                    </div> 
                    }
                </div>
                {/* Ticket Info Section */}
                <div className='my-6 p-4 border-2 border-gray-400 rounded-lg'>
                  <h4 className="tracking-wider font-semibold text-xl underline">Ticket Info:</h4>
                  <div className='flex flex-row space-x-2 my-3'>
                    <p className='font-bold tracking-wider'>Cost:</p>
                    <p>{ticketCost}</p>
                    <p>$ETH</p>
                  </div>
                  <div className='flex flex-row space-x-2 my-3'>
                    <p className='font-bold tracking-wider'>Limit:</p>
                    <p>{ticketMax} / per person</p>
                  </div>
                </div>
                <div className='my-4'>
                  <h3 className='text-3xl font-bold '>Buy a Ticket for Win the NFT Prize!</h3>
                  <h3 className='text-2xl font-medium mt-3'>
                    Buy entries for a chance to win the NFT! Winner will be selected and transferred the NFT. The more entries the higher chance you have of winning the prize.
                  </h3>
                </div>
                {winnerAddress ? 
                
                <div className='mx-12 py-4 border-4 rounded-xl border-green-600 bg-green-300 text-center flex flex-row space-x-2 items-center justify-center'>
                  <p className='font-bold text-xl'>Winner is </p>
                  <p className='font-bold text-2xl'>{winnerAddress}</p>
                </div>
                : 
                <div>
                  {/* Buy Ticket Section */}
                  <div className='flex flex-row space-x-2 my-8'>
                    <button onClick={handleTicketDecrease}><i className="fa-solid fa-minus"></i></button>
                    <input className='border-2 border-gray-500 width-10 font-bold text-center' value={ticketValue} onChange={handleTicketValue} type="number" disabled/>
                    <button onClick={handleTicketIncrease}><i className="fa-solid fa-plus"></i></button>
                    <button className='hover:text-gega-melon transition duration-500 tracking-widest rounded-lg border-2 border-blue-800 px-1 py-1 text-blue-800 font-bold' onClick={handleBuyTicket}>Buy Ticket</button>
                  </div>
                  {/* User Info Section */}
                  <div className='my-6 p-2 lg:p-4 border-2 border-gray-400 rounded-lg'>
                    <h4 className="tracking-wider font-semibold text-xl underline">User Info:</h4>
                    <div className='flex flex-row space-x-2 my-3'>
                      <p className='font-bold tracking-wider'>Wallet:</p>
                      <p className='text-sm lg:text-md'>{walletAddress}</p>
                    </div>
                    <div className='flex flex-row space-x-2 my-3'>
                      <p className='font-bold tracking-wider'>Ticket Count:</p>
                      <p>{userTickets}</p>
                    </div>
                  </div>
                </div>
                }
              </div>
            </div>
          </div>
          <div>
            <h2 className='text-center tracking-wider text-3xl font-bold'>All Buyers Info</h2>
            <div className='my-4 mx-4'>
              {buyers.length > 0 ? <p>Total Buyers: {buyers.length}</p> : ""}
              <p>Total Entries: {entries}</p>
            </div>
            <div className='my-4 mx-4'>
              <h4 className="tracking-wider font-semibold text-xl underline">Buyers List:</h4>
              <Buyers buyersArray={buyers}/>
            </div>
          </div>
        </div>
        :
        <div>
          <div className='mx-4 lg:mx-32 mt-12 lg:mt-20 mb-2 lg:mb-8'>
            <h1 className="text-3xl lg:text-6xl font-bold tracking-wider">
              You Can Get the Most Valuable NFTs
            </h1>
            <h1 className="text-3xl lg:text-6xl font-bold tracking-wider text-blue-800 mt-4">
              by Participating in the Raffles
            </h1>
            <div className='items-center mt-12 lg:mt-20 place-items-center content-center text-center'>
              <button disabled className='text-md lg:text-xl text-gray-500 border-2 border-blue-500 rounded-xl px-10 py-2 font-bold'>Let's Start with Wallet Connect</button>
            </div>
          </div>
          <div className="logos flex flex-row cursor-pointer select-none">
            <div className="logos-slide flex flex-row">
                <img src={RaffleNFT} className="lg:ml-10 rounded-lg" alt=""/>
                <img src={bayc} className="rounded-lg" alt=""/>
                <img src={cpunks} className="rounded-lg" alt=""/>
                <img src={beanz} className="rounded-lg" alt=""/>
                <img src={DeGods} className="rounded-lg" alt=""/>
                <img src={RaffleNFT} className="lg:ml-10 rounded-lg" alt=""/>
                <img src={Doodles} className="rounded-lg" alt=""/>
                <img src={milady} className="rounded-lg" alt=""/>
                <img src={bayc2} className="rounded-lg" alt=""/>
                <img src={cpunks2} className="rounded-lg" alt=""/>
            </div>
          </div>
        </div>
    }

    {(walletAddress == admin) ? 
    
    <div>
      <h2 className='text-center tracking-wider text-3xl font-bold'>Admin Panel</h2>
      <div className='mx-4 my-4 border-2 px-4 py-4'>
        <button className='hover:text-gega-melon transition duration-500 tracking-widest rounded-lg border-2 border-blue-800 px-1 py-1 text-blue-800 font-bold' onClick={mintNFT}>Mint NFT</button>
        <form onSubmit={showNFTOwner}>
          <input className='border-2' value={showNFTID} type="number" onChange={handleNFTID} />
          <button className='hover:text-gega-melon transition duration-500 tracking-widest rounded-lg border-2 border-blue-800 px-1 py-1 text-blue-800 font-bold' type='submit'>Show NFT Owner</button>
        </form>
      </div>
      
      <div className='mx-4 my-4 border-2 px-4 py-4'>
        <form onSubmit={beginRaffle}>
          <div className='flex flex-col space-y-2'>
            <div className='flex flex-row space-x-2'>
              <label>NFT Address:</label>
              <input className='border-2' value={raffleNFTAddress} type="text" onChange={handleRaffleNFT} />
            </div>
            <div className='flex flex-row space-x-2'>
              <label>NFT ID:</label>
              <input className='border-2' value={raffleNFTID} type="number" onChange={handleRaffleNFTID} />
            </div>
            <div>
              <button className='hover:text-gega-melon transition duration-500 tracking-widest rounded-lg border-2 border-blue-800 px-1 py-1 text-blue-800 font-bold' type='submit'>Start a Raffle</button>
            </div>
          </div>
        </form>
      </div>

      <div className='mx-4 my-4 border-2 px-4 py-4 flex flex-row space-x-2'>
        <button onClick={handleEndRaffle} className='hover:text-gega-melon transition duration-500 tracking-widest rounded-lg border-2 border-red-800 px-1 py-1 text-red-800 font-bold'>End Raffle</button>
        <button onClick={handlePickWinner} className='hover:text-gega-melon transition duration-500 tracking-widest rounded-lg border-2 border-blue-800 px-1 py-1 text-blue-800 font-bold'>Pick Winner</button>
      </div>
      
    </div>

    : 

    ""}

    <div className='mt-10'>
      <footer id='contact' className="bg-white rounded-lg shadow dark:bg-gray-900 m-4">
        <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
            <div className="sm:flex sm:items-center sm:justify-between">
                <a href="/" className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
                  <p className="text-2xl lg:text-3xl font-bold tracking-widest text-transparent bg-gradient-to-r bg-clip-text from-blue-800 to-gray-200">NFT RAFFLE</p>
                </a>
                <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
                    <li>
                        <a href="https://github.com/srknssmn" target="_blank" className="hover:underline me-4 md:me-6">Personal Github</a>
                    </li>
                    <li>
                        <a href="https://coinhunterstr.com/" target="_blank" className="hover:underline me-4 md:me-6">WEB</a>
                    </li>
                    <li>
                        <a href="https://twitter.com/CoinHuntersTR" target="_blank" className="hover:underline me-4 md:me-6">X (Twitter)</a>
                    </li>
                    <li>
                        <a href="https://www.youtube.com/@CoinHuntersTR" target="_blank" className="hover:underline me-4 md:me-6">Youtube</a>
                    </li>
                    <li>
                        <a href="https://twitter.com/CoinHuntersTR" target="_blank" className="hover:underline">Telegram</a>
                    </li>
                </ul>
            </div>
            <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
            <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2024 <a href="https://coinhunterstr.com/" target="_blank" className="hover:underline">CoinHunters™</a>. All Rights Reserved.</span>
        </div>
      </footer>
    </div>
    </>
  )
}

export default App