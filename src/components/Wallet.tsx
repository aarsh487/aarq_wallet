import { Keypair } from "@solana/web3.js";
import { generateMnemonic, mnemonicToSeed } from "bip39";
import { derivePath } from "ed25519-hd-key";
import React, { useState } from "react";
import nacl from "tweetnacl";
import bs58 from "bs58";

interface Wallet {
  publicKey: string;
  privateKey: string;
  mnemonic: string;
  path: string;
}

export const Wallet = () => {
  const [pathTypes, setPathTypes] = useState<string[]>([]);
  const [mneumonic, setMneumonic] = useState("");
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [currentIndex, setcurrentIndex] = useState(0);

  const createWallet = async() => {
    const seed = await mnemonicToSeed(mneumonic);
    const path = `m/44'/${pathTypes[0]}'/${currentIndex}'/0'`;
    const derivedSeed = derivePath(path, seed.toString("hex")).key;

    let publicKeyEncoded: string;
    let privateKeyEncoded: string;

    if (pathTypes[0] === "501") {
      const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
      const keypair = Keypair.fromSecretKey(secret);
      privateKeyEncoded = bs58.encode(keypair.secretKey);
      publicKeyEncoded = keypair.publicKey.toBase58();

    } else if (pathTypes[0] === "60") {

    } else {
      console.log("Error in pathTypes");
    }
  };

  const handleGenerateWallet = async () => {
    if (mneumonic) {
      console.log(mneumonic);
    } else {
      const mn = generateMnemonic();
      setMneumonic(mn);
      console.log(mn);
    }
  };

  return (
    <div>
      {pathTypes.length === 0 && (
        <div className="flex justify-center items-center h-screen">
          <div className="">
            <h1 className="my-8 text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-gray-500 text-center tracking-wide">
              Pick your chain, Forge your path
            </h1>
            <div className="flex gap-4 justify-center items-center">
              <button
                onClick={() => setPathTypes(["501"])}
                className="px-6 py-3 rounded-lg cursor-pointer bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition"
              >
                Solana
              </button>
              <button
                onClick={() => setPathTypes(["60"])}
                className="px-6 py-3 rounded-lg cursor-pointer bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition"
              >
                Ethereum
              </button>
            </div>
          </div>
        </div>
      )}

      {pathTypes.length !== 0 && (
        <div className="flex justify-center items-center h-screen">
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
  );
};
