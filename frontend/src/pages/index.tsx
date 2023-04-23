import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";

// EVM
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

//starknet
import {
  useAccount as useStarknetAccount,
  useConnectors,
  useContract as useStarknetContract,
} from "@starknet-react/core";

import { ConnectWallet } from "@/components/ConnectWallet";
import { Account, Contract, Provider, ProviderInterface } from "starknet";
import axios from "axios";
import { useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { address, isConnected } = useAccount();
  const [ownednfts, setOwnedNfts] = useState<any[]>();
  const [selectedTokenId, setSelectedTokenId] = useState<number>();
  const onClick = async () => {
    const res = await axios.post("/api/everai", {
      addr: address,
      tokenId: selectedTokenId,
    });
    console.log(res);
    console.log("hihi");
  };

  const onClick1 = async () => {
    const res = await axios.get("/api/ownednfts?addr=" + address);
    console.log(res.data.nftList);
    setOwnedNfts(res.data.nftList);
    console.log("hihi");
  };

  const handleSelection = async (tokenId: any) => {
    console.log(tokenId);
    setSelectedTokenId(tokenId);
  };

  return (
    <>
      <div>
        <div>
          <ConnectButton />
        </div>
        <div>
          <ConnectWallet />
        </div>
        <button onClick={onClick1}>getNFTs</button>
        {isConnected &&
          ownednfts?.map((nft) => (
            <div
              key={nft.id.tokenId}
              onClick={async () =>
                await handleSelection(parseInt(nft.id.tokenId))
              }>
              <Image
                src={nft.metadata.image}
                alt="pic"
                width={100}
                height={100}
              />
              <div>{nft.title}</div>
            </div>
          ))}
        {selectedTokenId && (
          <button onClick={onClick}>
            Generate Proof of Ownership of {selectedTokenId}
          </button>
        )}
      </div>
    </>
  );
}
