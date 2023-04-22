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

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const onClick = async () => {
    const res = await axios.get("/api/test");
    console.log(res);
    console.log("hihi");
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

        <button onClick={onClick}>click</button>
      </div>
    </>
  );
}
