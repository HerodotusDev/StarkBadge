import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";

// EVM
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  useAccount,
  useContract,
  useContractWrite,
  usePrepareContractWrite,
  useSigner,
} from "wagmi";

//starknet
import {
  useAccount as useStarknetAccount,
  useConnectors,
  useContract as useStarknetContract,
  useWaitForTransaction,
} from "@starknet-react/core";

import { ConnectWallet } from "@/components/ConnectWallet";
import { Account, Contract, Provider, ProviderInterface } from "starknet";

import { useEffect, useState } from "react";
import { everaiDuoABI } from "@/shared/everaiDuo";
import { MintNFT } from "@/components/MintNFT";
import { handleGenerateProof, handleOwnedNFTs } from "@/shared/axios";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { address, isConnected } = useAccount();
  const [ownednfts, setOwnedNfts] = useState<any[]>();
  const [selectedTokenId, setSelectedTokenId] = useState<number>();

  const updateOwnedNFT = (result: any) => {
    console.log(result);
    setOwnedNfts(result);
  };

  const handleSelection = async (tokenId: any) => {
    console.log(tokenId);
    setSelectedTokenId(tokenId);
  };

  const updateNFTState = async () => {
    const res = await handleOwnedNFTs(address as string);
    setOwnedNfts(res);
  };

  useEffect(() => {
    updateNFTState();
  }, [isConnected]);

  return (
    <>
      <div>
        <div>
          <ConnectButton />
        </div>
        <div>
          <ConnectWallet />
        </div>

        <MintNFT stateChanger={setOwnedNfts} />

        <div className={styles.wrappedNFTs}>
          {isConnected &&
            ownednfts?.map((nft) => (
              <div
                key={nft.id.tokenId}
                onClick={async () =>
                  await handleSelection(parseInt(nft.id.tokenId))
                }>
                <Image
                  className={
                    parseInt(nft.id.tokenId) === selectedTokenId
                      ? styles.selected
                      : undefined
                  }
                  src={nft.metadata.image}
                  alt="pic"
                  width={100}
                  height={100}
                />
                <div>{nft.title}</div>
              </div>
            ))}
        </div>

        <div className={styles.proofBtn}>
          {selectedTokenId ? (
            <button
              onClick={async () =>
                await handleGenerateProof(address as string, selectedTokenId)
              }>
              Generate Proof of Ownership of {selectedTokenId}
            </button>
          ) : (
            <div>Click NFT you want to generate proof of ownership</div>
          )}
        </div>
      </div>
    </>
  );
}
