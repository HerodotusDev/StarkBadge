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
  useSignMessage,
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
import { factoryABI } from "@/shared/factoryAbi";
import Link from "next/link";
import { recoverPublicKey } from "viem";
import { staradgeAbi } from "@/shared/staradgeAbi";

const inter = Inter({ subsets: ["latin"] });

type selectedTokenProveType = {
  block_number: number;
  calldata: any[];
  metadata: string;
};

export default function Home() {
  const { address, isConnected } = useAccount();
  const [ownednfts, setOwnedNfts] = useState<any[]>();
  const [selectedTokenId, setSelectedTokenId] = useState<number>();
  const [selectedBlockNumber, setSelectedBlockNumber] = useState<number>();
  const [selectedTokenProves, setSelectedTokenProves] =
    useState<selectedTokenProveType[]>();
  const [stepStatus, setStepStatus] = useState<number>(1);
  const [isMapping, setIsMapping] = useState(false);
  const [isLoadingProof, setIsLoadingProof] = useState<boolean>(false);

  // -------------------------------STARKNET START-------------------------------------------------------

  const { account: starknetAccount, isConnected: isStarknetConnected } =
    useStarknetAccount();

  const { data, isError, isLoading, isSuccess, signMessage } = useSignMessage({
    message: `Handling Mapping of everAi reflection nft. Destination is ${starknetAccount?.address}`,
  });

  const ReflectContract =
    "0x052cff61dcf94606146f7876127f31fe9c9c20b6369af5f92937f423eecc6b89";

  // ------------------ starknet contract write ------------------
  const provider = new Provider({ sequencer: { network: "goerli-alpha" } });
  const REFLECTION_CONTRACT = new Contract(
    staradgeAbi,
    "0x05e315337ca46eda13b1512e4454c23cd9ca89b5930d7e574238f66ab8386e0c",
    provider
  );
  if (starknetAccount !== undefined) {
    REFLECTION_CONTRACT.connect(starknetAccount);
  }

  // ------------------ end contract write ------------------

  // ------------------ start claim function write ------------------

  const handleClaiming = async () => {
    const claimNFT =
      selectedTokenProves?.filter(
        (ele) => ele?.block_number == selectedBlockNumber
      ) || [];
    const calldata_raw = claimNFT[0].calldata;
    const calldata_final = [
      selectedTokenId,
      selectedBlockNumber,
      address,
      calldata_raw[3],
      calldata_raw[4],
      calldata_raw[5],
      calldata_raw[6],
    ];
    console.log(calldata_final);

    const res = await REFLECTION_CONTRACT.invoke("mint", calldata_final);
    console.log(res, "ddd");
  };

  // -------------------------------STARKNET END-----------------------------------------------

  // -------------------------------ADDRESS VERIFICATION START------------------------------------------------

  const handleAddrMappingToStarknet = async () => {
    const signatureBuffer = Buffer.from(data as string);
    const v = signatureBuffer[64] + 27; // add 27 to get the recovery ID
    const r = signatureBuffer.slice(0, 32).toString("hex");
    const s = signatureBuffer.slice(32, 64).toString("hex");

    const public_key = await recoverPublicKey({
      hash: "0xd9eba16ed0ecae432b71fe008c98cc872bb4cc214d3220a36f365326cf807d68",
      signature:
        "0x66edc32e2ab001213321ab7d959a2207fcef5190cc9abb6da5b0d2a8a9af2d4d2b0700e2c317c4106f337fd934fbbb0bf62efc8811a78603b33a8265d3b8f8cb1c",
    });

    console.log({
      message: data,
      public_key: public_key,
      signature_r: r,
      signature_s: s,
    });

    // TODO : NEED TO CONNECT WITH STARKNET

    localStorage.setItem(
      "mapping_L1_L2",
      JSON.stringify({ L1: address, L2: starknetAccount?.address })
    );
    setIsMapping(true);
  };

  // -------------------------------ADDRESS VERIFICATION END------------------------------------------------

  const updateMappingState = async () => {
    const item = localStorage.getItem("mapping_L1_L2");
    const data = JSON.parse(item as string);
    if (data) {
      if (data.L1 == address && data.L2 == starknetAccount?.address) {
        setIsMapping(true);
      } else {
        setIsMapping(false);
      }
    } else {
      setIsMapping(false);
    }
  };

  const handleSelection = async (tokenId: any) => {
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
    setIsLoadingProof(true);
    await handleGenerateProof(address as string, selectedTokenId as number);
    await updateProofsStates(selectedTokenId as number);
    setIsLoadingProof(false);
  };

  // -------------------------------USE EFFECTS------------------------------------------------

  useEffect(() => {
    updateNFTState();
  }, [isConnected, address]);

  useEffect(() => {
    if (isSuccess) {
      handleAddrMappingToStarknet();
    }
  }, [isLoading]);

  useEffect(() => {
    updateMappingState();
  }, [isConnected, isStarknetConnected]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      updateMappingState();
    }
  }, []);

  return (
    <>
      <div>
        {isMapping && isConnected && isStarknetConnected ? (
          <>
            <div className={styles.navbar}>
              <div>
                <ConnectButton />
              </div>
              <div>
                <ConnectWallet />
              </div>
            </div>

            <div className={styles.mainWrappet}>
              <div className={styles.stepButton}>
                {stepStatus !== 1 && (
                  <div onClick={() => setStepStatus(stepStatus - 1)}>
                    STEP {stepStatus - 1}
                  </div>
                )}
              </div>
              {stepStatus == 1 ? (
                <>
                  {/* STEP1 : Select L1 NFT */}
                  <hr />
                  <div className={styles.step}>STEP1 : Select L1 NFT</div>

                  {ownednfts?.length ? (
                    <>
                      <div className={styles.stepDetail}>
                        Click NFT, that you want to generate proof of
                        ownership🛰️
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
                      <div>Or</div>
                      <MintNFT stateChanger={setOwnedNfts} />
                    </>
                  ) : (
                    <div className={styles.stepDetail}>
                      You have no NFT! Mint New one 🪄
                      <MintNFT stateChanger={setOwnedNfts} />
                    </div>
                  )}
                </>
              ) : stepStatus == 2 ? (
                <>
                  {/* STEP2 : Select L1 NFT blocknumber of proof */}
                  <hr />
                  <div className={styles.step}>
                    STEP2 : Select L1 NFT blocknumber of proof{" "}
                  </div>
                  <div className={styles.preproven}>
                    {selectedTokenProves?.length ? (
                      <div className={styles.description}>
                        #{selectedTokenId} already generated proof of
                        ownership🥳 Select the BlockNumber you want to reflect
                        to Starknet
                      </div>
                    ) : (
                      <div className={styles.description}>
                        #{selectedTokenId} have no proof of ownership yet.
                        Generate proof of latest Ethereum block
                      </div>
                    )}

                    {isLoadingProof ? (
                      <button className={styles.unproofbutton}>
                        ...Loading
                      </button>
                    ) : (
                      <button
                        className={styles.proofbutton}
                        onClick={clickGenerateProof}>
                        Create Latest Proof of Ownership
                      </button>
                    )}
                  </div>
                  <div
                    className={
                      selectedTokenProves?.length
                        ? styles.wrappedNFTs
                        : undefined
                    }>
                    {selectedTokenProves?.map((prove: any) => (
                      <div
                        key={prove.calldata[1]}
                        className={
                          parseInt(prove.block_number) === selectedBlockNumber
                            ? styles.selectedBlockNumber
                            : styles.unselectedBlockNumber
                        }
                        onClick={() =>
                          setSelectedBlockNumber(prove.block_number as number)
                        }>
                        <div>{prove.block_number}</div>
                      </div>
                    ))}
                  </div>
                </>
              ) : stepStatus == 3 ? (
                <>
                  {/* STEP3 : Claim on Starknet */}
                  <hr />
                  <div className={styles.step}>STEP3 : Claim on Starknet </div>
                  {selectedBlockNumber && (
                    <div className={styles.infoClaim}>
                      <div>Block Number : {selectedBlockNumber}</div>
                      <div>Token Id : {selectedTokenId}</div>
                      <div
                        className={styles.proofbutton}
                        onClick={handleClaiming}>
                        Create StarkBadge
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>THE END</>
              )}
              <div className={styles.nextButton}>
                {stepStatus == 1 && selectedTokenId && (
                  <div onClick={() => setStepStatus(stepStatus + 1)}>NEXT</div>
                )}
                {stepStatus == 2 && selectedBlockNumber && (
                  <div onClick={() => setStepStatus(stepStatus + 1)}>NEXT</div>
                )}
                {stepStatus == 0 && (
                  <div onClick={() => setStepStatus(stepStatus + 1)}>NEXT</div>
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className={styles.titleWrapper}>
              <div className={styles.pageTitle}>StarkBadge</div>
              <div className={styles.titleDescription}>
                <Link href={"https://github.com/HerodotusDev/StarkBadge"}>
                  {" "}
                  What is StarBadge? CLICK HERE
                </Link>
              </div>
            </div>
            <div className={styles.signupWrapper}>
              <div>
                <div className={styles.step}>
                  STEP 1 : Select Starknet Wallet
                </div>
                <ConnectWallet />
              </div>
              <div>
                <div className={styles.step}>
                  STEP 2 : Select Ethereum Wallet
                </div>
                <ConnectButton />
              </div>
              {isConnected && isStarknetConnected && (
                <div className={styles.infoClaim}>
                  <p>L1 : {address}</p>
                  <p>L2 : {starknetAccount?.address}</p>
                  <div
                    className={styles.proofbutton}
                    onClick={() => signMessage()}>
                    Sign up
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
