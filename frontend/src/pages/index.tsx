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

import { useEffect, useMemo, useState } from "react";
import { everaiDuoABI } from "@/shared/everaiDuo";
import { MintNFT } from "@/components/MintNFT";
import { handleGenerateProof, handleOwnedNFTs } from "@/shared/axios";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { address, isConnected } = useAccount();
  const [ownednfts, setOwnedNfts] = useState<any[]>();
  const [selectedTokenId, setSelectedTokenId] = useState<number>();
  const [selectedBlockNumber, setSelectedBlockNumber] = useState<number>();
  const [selectedTokenProves, setSelectedTokenProves] = useState<[]>();
  const { account: starknetAccount } = useStarknetAccount();
  const { connect, connectors } = useConnectors();
  const ReflectContract =
    "0x052cff61dcf94606146f7876127f31fe9c9c20b6369af5f92937f423eecc6b89";

  // const connector = useMemo(
  //   () => connectors.find((c) => c.options.id === "argentX") ?? connectors[0],
  //   [connectors]
  // );
  // console.log(connector, "index");

  // ------------------ starknet contract write ------------------
  const provider = new Provider({ sequencer: { network: "goerli-alpha" } });
  const FACTORY_CONTRACT = new Contract(
    everaiDuoABI,
    "0x005e7ccdc3677133173038d8cca7ed66236f25ff28b47c36549705337c931291",
    provider
  );
  if (starknetAccount !== undefined) {
    FACTORY_CONTRACT.connect(starknetAccount);
  }

  // ------------------ end contract write ------------------

  const claimNFT = async () => {
    console.log(ReflectContract, selectedTokenProves, "dagewgewwggwe");

    const res = await FACTORY_CONTRACT.invoke("mint_coupon", [
      ReflectContract,
      selectedTokenProves,
    ]);
  };

  // const updateOwnedNFT = (result: any) => {
  //   console.log(result);
  //   setOwnedNfts(result);
  // };

  const handleSelection = async (tokenId: any) => {
    console.log(tokenId);
    setSelectedTokenId(tokenId);
    updateProofsStates(tokenId);
  };

  const updateNFTState = async () => {
    const res = await handleOwnedNFTs(address as string);
    setOwnedNfts(res);
  };

  const updateProofsStates = async (tokenId: number) => {
    const result = localStorage.getItem("proofs") || "{}";
    const proofs = JSON.parse(result)[tokenId];
    setSelectedBlockNumber(undefined);
    setSelectedTokenProves(proofs);
  };

  const clickGenerateProof = async () => {
    await handleGenerateProof(address as string, selectedTokenId as number);
    await updateProofsStates(selectedTokenId as number);
  };

  const handleClaiming = async (block_number: any) => {
    setSelectedBlockNumber(block_number);
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

        {/* STEP0 : (optional) Mint NFT on L1 */}
        <div className={styles.step}>STEP0 : (optional) Mint NFT on L1</div>
        <MintNFT stateChanger={setOwnedNfts} />

        {/* STEP1 : Select L1 NFT */}
        <div>STEP1 : Select L1 NFT</div>
        <div className={styles.description}>
          Click NFT, that you want to generate proof of ownership🛰️
        </div>
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

        {/* STEP2 : Select L1 NFT blocknumber of proof */}
        <div className={styles.step}>
          STEP2 : Select L1 NFT blocknumber of proof{" "}
        </div>
        <div className={styles.preproven}>
          {selectedTokenProves?.length ? (
            <div className={styles.description}>
              #{selectedTokenId} already generated proof of ownership🥳 Select
              the BlockNumber you want to reflect to Starknet
            </div>
          ) : (
            <div className={styles.description}>
              #{selectedTokenId} don't have proof of ownership yet. Generate
              proof of latest Ethereum block
            </div>
          )}
          <button className={styles.proofbutton} onClick={clickGenerateProof}>
            Create new Proof of {selectedTokenId}
          </button>
        </div>

        <div className={styles.wrappedNFTs}>
          {selectedTokenProves?.map((prove: any) => (
            <div
              className={
                parseInt(prove.block_number) === selectedBlockNumber
                  ? styles.selectedBlockNumber
                  : styles.unselectedBlockNumber
              }
              onClick={async () =>
                await handleClaiming(prove.block_number as number)
              }>
              <div>{prove.block_number}</div>
            </div>
          ))}
        </div>

        {/* STEP3 : Claim on Starknet */}
        <div className={styles.step}>STEP3 : Claim on Starknet </div>
        {selectedBlockNumber && (
          <div className={styles.infoClaim}>
            <div>Blocktimes : {selectedBlockNumber}</div>
            <div>TokenId : {selectedTokenId}</div>
            <div
              className={styles.proofbutton}
              onClick={async () =>
                await handleGenerateProof(
                  address as string,
                  selectedTokenId as number
                )
              }>
              Create Reflection Proof of Ownership{" "}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
