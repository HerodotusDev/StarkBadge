import { useAccount, useConnectors, useStarknet } from "@starknet-react/core";

import { HiOutlineLogout } from "react-icons/hi";
import Image from "next/image";
import styled from "@emotion/styled";
import { useMemo } from "react";

const truncateHash = (hash: any) => hash.slice(0, 5) + "..." + hash.slice(-5);

export default function ConnectWallet() {
  const { account } = useAccount();
  const { connectors, connect, disconnect } = useConnectors();

  const connector = useMemo(
    () => connectors.find((c) => c.options.id === "argentX") ?? connectors[0],
    [connectors]
  );

  if (account)
    return (
      <StyledConnectWallet>
        <span>{truncateHash(account.address)}</span>
        <LogoutIcon title="disconnect" onClick={() => disconnect()} />
      </StyledConnectWallet>
    );
  else
    return (
      <StyledConnectWallet
        title="connect"
        onClick={() => (connector ? connect(connector) : undefined)}>
        <span>connect {connector.id()}</span>
        <Image
          src="https://images.prismic.io/argentwebsite/313db37e-055d-42ee-9476-a92bda64e61d_logo.svg"
          width={40}
          height={40}
          alt="img"
        />
      </StyledConnectWallet>
    );
}

const StyledConnectWallet = styled.div`
  position: fixed;
  top: 40px;
  right: 40px;
  color: #ff875b;
  cursor: pointer;
  user-select: none;
  display: flex;
  align-items: center;
  > span {
    margin-right: 16px;
  }
  :hover {
    color: orange;
  }
`;

const LogoutIcon = styled(HiOutlineLogout)`
  width: 32px;
  height: 32px;
`;
