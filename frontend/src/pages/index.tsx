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
    const result = localStorage.getItem("proofs") || "{}";
    const proofs = JSON.parse(result)[tokenId];
    setSelectedTokenProves(proofs);
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
        <div>Click NFT you want to generate proof of ownership</div>

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
        <div className={styles.preproven}>
          {selectedTokenProves?.length ? (
            <p>
              #{selectedTokenId} already generated proof of ownership🥳 Select
              the BlockNumber you want to reflect to Starknet
            </p>
          ) : (
            <p>
              #{selectedTokenId} don't have proof of ownership yet. Generate
              proof of latest Ethereum block
            </p>
          )}

          {selectedTokenProves?.map((prove) => (
            <div>
              <div>{prove.block_number}</div>
            </div>
          ))}
        </div>

        <div className={styles.proofBtn}>
          {!selectedTokenProves ? (
            <button
              onClick={async () =>
                await handleGenerateProof(
                  address as string,
                  selectedTokenId as number
                )
              }>
              Generate Proof of Ownership of {selectedTokenId}
            </button>
          ) : (
            <button
              onClick={async () =>
                await handleGenerateProof(
                  address as string,
                  selectedTokenId as number
                )
              }>
              Reflect Proof of Ownership of Blocktimes : {selectedBlockNumber}
              TokenId : {selectedTokenId}
            </button>
          )}
        </div>
      </div>
    </>
  );
}
