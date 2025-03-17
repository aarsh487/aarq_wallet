import { Keypair } from "@solana/web3.js";
import { generateMnemonic, mnemonicToSeedSync, validateMnemonic } from "bip39";
import { derivePath } from "ed25519-hd-key";
import React, { useState } from "react";
import nacl from "tweetnacl";
import bs58 from "bs58";
import { HDNodeWallet, Wallet } from "ethers";
import { Eye, EyeOff } from "lucide-react";

interface WalletType {
  publicKey: string;
  privateKey: string;
  mneumonic: string;
  path: string;
}

export const WebWallet = () => {
  const [mneumonicWords, setMneumonicWords] = useState<string[]>(
    Array(12).fill(" ")
  );
  const [ pathTypes, setPathTypes ] = useState<string[]>([]);
  const [ mneumonic, setMneumonic ] = useState("");
  const [ wallets, setWallets ] = useState<WalletType[]>([]);
  const [ showMnemonic, setShowMnemonic ] = useState(false);
  const [showPrivateKey, setShowPrivateKey ] = useState(false);

  const createWallet = (
    pathTypes: string,
    mneumonic: string,
    currentIndex: number
  ): WalletType | null => {
    try {
      const seed = mnemonicToSeedSync(mneumonic);
      const path = `m/44'/${pathTypes}'/${currentIndex}'/0'`;
      const derivedSeed = derivePath(path, seed.toString("hex")).key;

      let publicKeyEncoded: string;
      let privateKeyEncoded: string;

      if (pathTypes === "501") {
        const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
        const keypair = Keypair.fromSecretKey(secret);
        privateKeyEncoded = bs58.encode(keypair.secretKey);
        publicKeyEncoded = keypair.publicKey.toBase58();
      } else if (pathTypes === "60") {
        const derivationPath = `m/44'/${pathTypes}'/${currentIndex}`;
        const hdNode = HDNodeWallet.fromSeed(seed);
        const child = hdNode.derivePath(derivationPath);
        const privateKey = child.privateKey;
        const wallet = new Wallet(privateKey);
        publicKeyEncoded = wallet.address;
        privateKeyEncoded = privateKey;
      } else {
        console.log("Error in pathTypes");
        return null;
      }

      return {
        publicKey: publicKeyEncoded,
        privateKey: privateKeyEncoded,
        mneumonic,
        path,
      };
    } catch (error) {
      console.log("server error", error);
      return null;
    }
  };

  const handleAddWallet = () => {
    if (!mneumonicWords) {
      console.log("no words found");
      return;
    }
    const wallet = createWallet(
      pathTypes[0],
      mneumonicWords.join(" "),
      wallets.length
    );
    if (wallet) {
      const newWallet = [...wallets, wallet];
      setWallets(newWallet);
    }
  };

  const handleGenerateWallet = async () => {
    let mn = mneumonic.trim();
    if (mn) {
      console.log("mn",mneumonic);
      if (!validateMnemonic(mn)) {
        console.log("not valid")
        return
      };
    } else {
      mn = generateMnemonic();
    }
    const mns = mn.split(" ");
    setMneumonicWords(mns);
    console.log(mns);
    const wallet = createWallet(pathTypes[0], mn, wallets.length);

    if (wallet) {
      const newWallet = [...wallets, wallet];
      setWallets(newWallet);
    }
  };

  return (
    <div className="">
      {wallets.length === 0 && (
        <div className="mt-40">
          {pathTypes.length === 0 && (
            <div className="flex justify-center items-center">
              <div className="">
                <h1 className="mb-8 text-2xl md:text-4xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-gray-500 text-center tracking-wide">
                  Pick your chain, Forge your path
                </h1>
                <div className="flex gap-4 justify-center items-center">
                  <button
                    onClick={() => setPathTypes(["501"])}
                    className="px-4 py-2 md:py-3 md:px-6 rounded-lg cursor-pointer bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition"
                  >
                    Solana
                  </button>
                  <button
                    onClick={() => setPathTypes(["60"])}
                    className="px-4 py-2 md:py-3 md:px-6 rounded-lg cursor-pointer bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition"
                  >
                    Ethereum
                  </button>
                </div>
              </div>
            </div>
          )}

          {pathTypes.length !== 0 && (
            <div className="flex justify-center items-center">
              <div className="space-y-20">
                <h1 className="mb-2 text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-gray-500 text-center tracking-wide">
                  Secure Seed Phrase
                </h1>
                <p className="mb-8 text-xl md:text-2xl font-bold text-gray-300 text-center tracking-wide">
                  Lose them, lose access.
                </p>
                <div className="flex gap-4 justify-center items-center">
                  <input
                    type="text"
                    onChange={(e) => setMneumonic(e.target.value)}
                    value={mneumonic}
                    placeholder="12 words to rule them all..."
                    className="p-4 backdrop-blur-md border border-white/20 text-white"
                  />
                  <button
                    onClick={() => handleGenerateWallet()}
                    className="px-6 py-3 rounded-lg cursor-pointer bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition"
                  >
                    {mneumonic ? "Add Wallet" : "Create Wallet"}
                  </button>
                </div>
                <p className="-mt-16 text-md md:text-sm text-gray-300 text-center">
                  Oops, No Seed? No Problem! Let Fate Generate One!
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {wallets.length > 0 && (
        <div className="mt-10">
          <div className="flex gap-4 justify-center items-center">
            <button
              className="px-6 py-3 rounded-lg cursor-pointer bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition"
              onClick={handleAddWallet}
            >
              Add Wallet
            </button>
            <button
              className="px-6 py-3 rounded-lg cursor-pointer bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition"
              onClick={() => setShowMnemonic(true)}
            >
              Show Mneumonic
            </button>
          </div>
          <div className="lg:px-40 md:px-20 px-4 mt-20">
            <h2 className="lg:text-3xl text-2xl font-bold mb-4">Your Wallets</h2>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              {wallets.map((wallet, index) => (
                <div
                  key={index}
                  className="relative p-8 bg-gray-800 rounded-lg border border-gray-700"
                >
                  <h3 className="lg:text-xl text-lg font-bold mb-2">Wallet {index + 1}</h3>
                  <p className="mb-4">
                    <strong className="lg:text-lg text-md">Public Key:</strong>{" "}<br />
                    <span className="break-all text-blue-400 text-sm lg:text-lg">
                      {wallet.publicKey}
                    </span>
                  </p>
                  <p className="">
                    <strong className="lg:text-lg text-md">Private Key:</strong>{" "}<br />
                    <span className="break-all text-red-400 lg:text-lg text-sm">
                      {showPrivateKey ? wallet.privateKey : "*".repeat(wallet.mneumonic.length)}
                    </span>
                  </p>
                  <button className="absolute cursor-pointer bottom-8 right-8" onClick={() => setShowPrivateKey(!showPrivateKey)}>{showPrivateKey ? <Eye size={20} /> : <EyeOff size={20} />}</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <div>
        {showMnemonic && (
          <div className="">
            <div className="fixed inset-0 flex justify-center items-center bg-black/20 backdrop-blur-xs  bg-opacity-50">
              <div className="bg-gray-800 p-6 rounded-lg lg:max-w-[600px] max-w-[400px] text-center relative">
                <button
                  onClick={() => setShowMnemonic(false)}
                  className="absolute cursor-pointer top-3 right-4 text-gray-400 hover:text-white"
                >
                  ✖
                </button>
                <h2 className="lg:text-2xl text-xl font-bold mb-8">Your Mnemonic</h2>
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  {mneumonicWords.map((word, index) => (
                    <span
                      key={index}
                      className="lg:px-10 lg:py-2 px-2 py-1 bg-gray-700 rounded-md"
                    >
                      {word}
                    </span>
                  ))}
                </div>
                {/* <button
                  onClick={() => setShowMnemonic(false)}
                  className="px-6 py-3 rounded-lg cursor-pointer bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition"
                >
                  Copy
                </button> */}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
