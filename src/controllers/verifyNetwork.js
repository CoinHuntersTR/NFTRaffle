export const verifyNetwork = async () => {

    // Sepolia Network Verifying
    const modeID = await '0x868b';
    const chainId = await window.ethereum.request({
        method: 'eth_chainId',
      });
    
    if (chainId === modeID){
        console.log("Bravo!, you are on the correct network")
        
    } else {
  
        console.log("oulalal, switch to the correct network");
        
        try {
        
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: modeID}],
            });
            console.log("You have succefully switched to Taiko Jolnir Testnet")
        
        } catch (switchError) {
            
            // This error code indicates that the chain has not been added to MetaMask.
            if (switchError.code === 4902) {
                console.log("This network is not available in your metamask, please add it")

                try {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [
                        { chainId: '0x868b', 
                        chainName:'Mode Mainnet',
                        rpcUrls:['https://mainnet.mode.network'],
                        nativeCurrency: {
                        symbol:'ETH', // 2-6 characters long
                    decimals: 18
                    }
                        
                        }],
                    });
                    } catch (addError) {
                        // handle "add" error
                        console.log(addError);
                    }
            }
        }
    }
};