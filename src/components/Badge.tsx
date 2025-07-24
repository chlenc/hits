import styled from "@emotion/styled";

const BasicBadge = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;

  font-family: "Instrument Sans";
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 100%;
  letter-spacing: -0.12px;

  height: 24px;
  padding: 0 8px;

  border-radius: 16px;
  box-sizing: border-box;
  z-index: 1;
  background: #2b2a2a;
  color: #d9d9d9;
`;

const StatusBadge = styled(BasicBadge)<{ status: "Active" | "Open" | "Expired" }>`
  background: ${({ status }) =>
    status === "Active"
      ? "#70EC9E"
      : status === "Expired"
      ? "#4E4C51"
      : "#8F4AF5"};
  color: ${({ status }) => (status === "Active" ? "#000" : "#fff")};
  border: 1px solid
    ${({ status }) => (status === "Active" ? "#70EC9E" : "#222024")};
`;

const ProfitBadge = styled(BasicBadge)<{ status: "profit" | "loss" }>`
  background: transparent;
  color: ${({ status }) => (status === "profit" ? "#70EC9E" : "#ED5959")};
  border: 1px solid
    ${({ status }) => (status === "profit" ? "#70EC9E" : "#ED5959")};
`;

export { BasicBadge, StatusBadge, ProfitBadge };