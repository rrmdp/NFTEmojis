import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';
import loader from './assets/loading.svg';
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import myEpicNft from './utils/MyEpicNFT.json';
import Particles from "react-tsparticles";



const TWITTER_HANDLE = 'rrmdp';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = '';
const TOTAL_MINT_COUNT = 50;

const CONTRACT_ADDRESS = "0xAf9d348DEb0E1029a3a851D160Ae6F0438027a17";



const App = () => {

    const [currentAccount, setCurrentAccount] = useState("");
     const [ minted, setMinted] = useState("");
     const [ loaderClass, setLoaderClass] = useState("hidden");

     const [ confetti, setConfetti] = useState(false);
     const [ mintText, setMintText] = useState("Mint NFT");
  

    
    const checkIfWalletIsConnected = async () => {
      const { ethereum } = window;

      if (!ethereum) {
          console.log("Make sure you have metamask!");
          return;
      } else {
          console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (accounts.length !== 0) {
          const account = accounts[0];
          console.log("Found an authorized account:", account);
          setCurrentAccount(account)
          // Setup listener! This is for the case where a user comes to our site
          // and ALREADY had their wallet connected + authorized.
          setupEventListener()
      } else {
          console.log("No authorized account found")
      }
  }


  /*
  * Implement your connectWallet method here
  */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      /*
      * Fancy method to request access to account.
      */
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      /*
      * Boom! This should print out public address once we authorize Metamask.
      */
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]); 

      let chainId = await ethereum.request({ method: 'eth_chainId' });
console.log("Connected to chain " + chainId);

// String, hex code of the chainId of the Rinkebey test network
const rinkebyChainId = "0x4"; 
if (chainId !== rinkebyChainId) {
	alert("You are not connected to the Rinkeby Test Network!");
}

       // Setup listener! This is for the case where a user comes to our site
      // and connected their wallet for the first time.
      setupEventListener() 
    } catch (error) {
      console.log(error)
    }
  }


    // Setup our listener.
  const setupEventListener = async () => {
    // Most of this looks the same as our function askContractToMintNft
    try {
      const { ethereum } = window;

      if (ethereum) {
        // Same stuff again
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);

        // THIS IS THE MAGIC SAUCE.
        // This will essentially "capture" our event when our contract throws it.
        // If you're familiar with webhooks, it's very similar to that!
        connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber())
          console.log(`Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`)
          setMinted(`https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`);
          setConfetti(true);

          setTimeout(() => {setConfetti(false);},5000);
          
           setMintText("Mint NFT"); 
          setLoaderClass("");
        });

        console.log("Setup event listener!")

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const askContractToMintNft = async () => {
  // setLoaderClass("minting");
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);

        console.log("Going to pop wallet now to pay gas...")
        let nftTxn = await connectedContract.makeAnEpicNFT();
 setMinted("");
 setMintText("Minting...");        
setLoaderClass("minting");
        console.log("Minting...please wait.")
        await nftTxn.wait();

      
        
        console.log(`Minted, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
}

  useEffect(() => {
    checkIfWalletIsConnected();
    LoadExternalScript();
  }, [])

  function loadError(onError) {
  console.error(`Failed ${onError.target.src} didn't load correctly`);
}


//function External() {
 // React.useEffect(() => {
    const LoadExternalScript = () => {
      const externalScript = document.createElement("script");
      externalScript.onerror = loadError;
      externalScript.id = "external";
      externalScript.async = true;
      externalScript.type = "text/javascript";
      externalScript.setAttribute("crossorigin", "anonymous");
      document.body.appendChild(externalScript);
      externalScript.src = `https://unpkg.com/embeddable-nfts/dist/nft-card.min.js`;
    };
    //LoadExternalScript();
  //}, []);

  //return <></>;
//}

const particles = {
        background: {
          color: {
            value: "transparent"
          }
        },
        fullScreen: {
          enable: true,
          zIndex: 1000
        },
        interactivity: {
          detectsOn: "window"
        },
        emitters: {
          position: {
            x: 50,
            y: 100
          },
          rate: {
            quantity: 10,
            delay: 0.25
          }
        },
        particles: {
          color: {
            value: ["#1E00FF", "#FF0061", "#E1FF00", "#00FF9E"]
          },
          move: {
            decay: 0.05,
            direction: "bottom",
            enable: true,
            gravity: {
              enable: false,
              maxSpeed: 150
            },
            outModes: {
              top: "none",
              //default: "destroy"
            },
            speed: { min: 25, max: 50 }
          },
          number: {
            value: 0
          },
          opacity: {
            value: 1
          },
          rotate: {
            value: {
              min: 0,
              max: 360
            },
            direction: "random",
            animation: {
              enable: true,
              speed: 30
            }
          },
          tilt: {
            direction: "random",
            enable: true,
            value: {
              min: 0,
              max: 360
            },
            animation: {       
              enable: true,
              speed: 30
            }
          },
          size: {
            value: 8
          },
          roll: {
            darken: {
              enable: true,
              value: 25
            },
            enable: true,
            speed: {
              min: 5,
              max: 15
            }
          },
          wobble: {
            distance: 30,
            enable: true,
            speed: {
              min: -7,
              max: 7
            }
          },
          shape: {
            type: [
             // "circle",
              //"square",
              //"polygon",
              "character",
              "character",
              "character",
              //"image",
             // "image",
             // "image"
            ],
            options: {
              image: [
                {
                  src: "https://particles.js.org/images/fruits/apple.png",
                  width: 32,
                  height: 32,
                  particles: {
                    size: {
                      value: 16
                    }
                  }
                },
                {
                  src: "https://particles.js.org/images/fruits/avocado.png",
                  width: 32,
                  height: 32,
                  particles: {
                    size: {
                      value: 16
                    }
                  }
                },
                {
                  src: "https://particles.js.org/images/fruits/banana.png",
                  width: 32,
                  height: 32,
                  particles: {
                    size: {
                      value: 16
                    }
                  }
                },
                {
                  src: "https://particles.js.org/images/fruits/berries.png",
                  width: 32,
                  height: 32,
                  particles: {
                    size: {
                      value: 16
                    }
                  }
                },
                {
                  src: "https://particles.js.org/images/fruits/cherry.png",
                  width: 32,
                  height: 32,
                  particles: {
                    size: {
                      value: 16
                    }
                  }
                },
                {
                  src: "https://particles.js.org/images/fruits/grapes.png",
                  width: 32,
                  height: 32,
                  particles: {
                    size: {
                      value: 16
                    }
                  }
                },
                {
                  src: "https://particles.js.org/images/fruits/lemon.png",
                  width: 32,
                  height: 32,
                  particles: {
                    size: {
                      value: 16
                    }
                  }
                },
                {
                  src: "https://particles.js.org/images/fruits/orange.png",
                  width: 32,
                  height: 32,
                  particles: {
                    size: {
                      value: 16
                    }
                  }
                },
                {
                  src: "https://particles.js.org/images/fruits/peach.png",
                  width: 32,
                  height: 32,
                  particles: {
                    size: {
                      value: 16
                    }
                  }
                },
                {
                  src: "https://particles.js.org/images/fruits/pear.png",
                  width: 32,
                  height: 32,
                  particles: {
                    size: {
                      value: 16
                    }
                  }
                },
                {
                  src: "https://particles.js.org/images/fruits/pepper.png",
                  width: 32,
                  height: 32,
                  particles: {
                    size: {
                      value: 16
                    }
                  }
                },
                {
                  src: "https://particles.js.org/images/fruits/plum.png",
                  width: 32,
                  height: 32,
                  particles: {
                    size: {
                      value: 16
                    }
                  }
                },
                {
                  src: "https://particles.js.org/images/fruits/star.png",
                  width: 32,
                  height: 32,
                  particles: {
                    size: {
                      value: 16
                    }
                  }
                },
                {
                  src: "https://particles.js.org/images/fruits/strawberry.png",
                  width: 32,
                  height: 32,
                  particles: {
                    size: {
                      value: 16
                    }
                  }
                },
                {
                  src: "https://particles.js.org/images/fruits/watermelon.png",
                  width: 32,
                  height: 32,
                  particles: {
                    size: {
                      value: 16
                    }
                  }
                },
                {
                  src:
                    "https://particles.js.org/images/fruits/watermelon_slice.png",
                  width: 32,
                  height: 32,
                  particles: {
                    size: {
                      value: 16
                    }
                  }
                }
              ],
              polygon: [
                {
                  sides: 5
                },
                {
                  sides: 6
                }
              ],
              character: [
                {
                  fill: true,
                  font: "Verdana",
                  value: ["😄", "🔥", "🍀", "🐺", "🦄", "🍒"],
                  style: "",
                  weight: 400
                }
              ]
            }
          }
        }
      }

   

     /* <Particles options={particles} /> */

  /*
  * Added a conditional render! We don't want to show Connect to Wallet if we're already conencted :).
  */
  return (
    
    <div className="App">
    <div className="container">
    {confetti ? (
    <Particles  options={particles} />
    ):(<span></span>)}
      
        <div className="header-container">
          <p className="header gradient-text">Rod's NFT Emoji Box</p>
          <p className="sub-text">
            Each unique. Each beautiful. Each 6 random emojis box.
          </p>
         {currentAccount && (
            <div className="accounts">
              {currentAccount}
            </div>
          )}
          {currentAccount === "" ? (
            <button onClick={connectWallet} className="cta-button connect-wallet-button">
              Connect to Wallet
            </button>
          ) : (
            <button onClick={askContractToMintNft} className="cta-button connect-wallet-button">
              {mintText} <img src={loader} className={loaderClass}/>
            </button>
          )}

          {minted !== "" ?
          ( <p><a className="cta-button minted" href={minted} target="_blank">View NFT on OpenSea 🌊 </a></p>) : (
            <p></p>
          )}
        </div>
        <div className="nft-card-container">
          <div className="nft-card-item">
            <img className="Image--image" src="https://storage.opensea.io/files/ea76df8752a7a43dd2ee3278c5361351.svg" />
          </div>
          <div className="nft-card-item">
            <img className="Image--image" src="https://storage.opensea.io/files/11d1ea89733fdec27ec53bc8eac9c124.svg" />
          </div>
          <div className="nft-card-item">
            <img className="Image--image" src="https://storage.opensea.io/files/e4ab063fef36502a7cc3c6a9efab0189.svg" />
          </div>
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built by @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;