import React from "react";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import loadingIcon from "../assets/icons/loading.svg";

const pulse = keyframes`
  0% {
    opacity: 0.4;
    transform: scale(0.8);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0.4;
    transform: scale(0.8);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  min-height: 200px;
`;

const LoadingIcon = styled.img`
  width: 48px;
  height: 48px;
  animation: ${pulse} 1.5s ease-in-out infinite;
`;

interface LoadingProps {
  size?: number;
  className?: string;
}

const Loading: React.FC<LoadingProps> = ({ size = 128, className }) => {
  return (
    <LoadingContainer className={className}>
      <LoadingIcon
        src={loadingIcon}
        alt="Loading..."
        style={{ width: size, height: size }}
      />
    </LoadingContainer>
  );
};

export default Loading;
