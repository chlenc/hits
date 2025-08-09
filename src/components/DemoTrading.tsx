import { Column, Row } from "./Flex";
import styled from "@emotion/styled";
import { useEffect, useState } from "react";

const SecondaryText = styled.div<{
  align?: "left" | "right" | "center";
  color?: string;
}>`
  color: ${({ color }) => color || "#6f6f70"};
  text-align: ${({ align }) => align || "left"};

  font-family: "Instrument Sans";
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 140%; /* 16.8px */
  letter-spacing: -0.12px;
`;

const PulsingDot = () => {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse((prev) => !prev);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Column
      alignItems="center"
      justifyContent="center"
      style={{ width: 16, height: 16 }}
    >
      <span
        style={{
          display: "inline-block",
          width: 4,
          height: 4,
          borderRadius: "50%",
          background: "#19F096",
          boxShadow: pulse
            ? "0 0 0 1px rgba(25, 240, 150, 0.3)"
            : "0 0 0 0px rgba(25, 240, 150, 0.0)",
          transform: pulse ? "scale(1.5)" : "scale(1)",
          transition:
            "box-shadow 0.5s cubic-bezier(0.4,0,0.2,1), transform 0.5s cubic-bezier(0.4,0,0.2,1)",
          verticalAlign: "middle",
        }}
      />
    </Column>
  );
};

const DemoTrading = ({ style }: { style?: React.CSSProperties }) => {
  return (
    <Row alignItems="center" mainAxisSize="fit-content" style={style}>
      <PulsingDot />
      <SecondaryText color="#70EC9E">Demo Trading Mode</SecondaryText>
    </Row>
  );
};

export default DemoTrading;
