import { ethers } from "ethers";
import {NFT_ADDRESS} from "../constants/address.js";
import {NFT_ABI} from "../constants/abi.js";

export const NFTContract = () => {

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(NFT_ADDRESS, NFT_ABI, signer);
  return contract;
}