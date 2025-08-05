import styled from "@emotion/styled";
import React, { type HTMLAttributes, useState } from "react";
import Tooltip from "./Tooltip";
import SizedBox from "../../../components/SizedBox";
import { Column } from "../../../components/Flex";

type TSelectKind = "fill" | "text";
type TSelectTextSize = "medium";

interface IOption {
  key: string;
  title: string;
  logo: string;
}

interface IProps extends Omit<HTMLAttributes<HTMLDivElement>, "onSelect"> {
  options: IOption[];
  selected?: IOption;
  kind?: TSelectKind;
  textSize?: TSelectTextSize;
  fullWidth?: boolean;
  onSelect: (key: IOption) => void;
}

const Root = styled.div<{
  focused?: boolean;
  kind?: TSelectKind;
  textSize?: TSelectTextSize;
  fullWidth?: boolean;
}>`
  display: flex;
  box-sizing: border-box;
  font-size: 12px;
  font-style: normal;
  font-weight: 700;
  line-height: 16px;
  padding: 12px;
  border-radius: 45px;
  background: #eaeeff;

  ${({ fullWidth }) =>
    fullWidth &&
    `
    width: 100%;
    justify-content: space-between;
  `}

  outline: none;
  color: #161616;
  align-items: center;
  white-space: nowrap;

  .menu-icon {
    width: 24px;
    height: 24px;
    //border-radius: 50%;
  }

  .menu-arrow {
    transition: 0.4s;
    transform: ${({ focused }) =>
      focused ? "rotate(180deg)" : "rotate(0deg)"};
  }
`;
const Option = styled.div<{ active?: boolean }>`
  display: flex;
  cursor: pointer;
  position: relative;
  align-items: center;
  font-size: 12px;
  font-style: normal;
  font-weight: 700;
  line-height: 16px;

  width: calc(100% - 24px);
  color: #161616;
  padding: 4px 6px;
  background: white;
  white-space: nowrap;

  :hover {
    background: #eaeeff;
    border-radius: 8px;
  }

  ::after {
    background: #eaeeff;
    border-radius: 8px;
  }
`;

const Select: React.FC<IProps> = ({ options, selected, onSelect, ...rest }) => {
  const [visible, setVisible] = useState(false);
  return (
    <Tooltip
      config={{
        placement: "bottom-end",
        trigger: "click",
        onVisibleChange: setVisible,
        visible,
      }}
      content={
        <Column crossAxisSize="max" className="menu-options">
          {options.map((v) => {
            const active = selected?.key === v.key;
            return (
              <Option
                active={active}
                key={v.key + "_option"}
                onClick={() => {
                  onSelect(v);
                  setVisible(false);
                }}
              >
                <img
                  src={v?.logo}
                  style={{ width: 24, height: 24 }}
                  alt="logo"
                />
                <SizedBox width={4} />
                {v.title}
              </Option>
            );
          })}
        </Column>
      }
      style={{ width: "100%" }}
    >
      <Root {...rest}>
        <img src={selected?.logo} className="menu-icon" alt="logo" />
        <SizedBox width={4} />
        <div>{selected?.title ?? options[0].title}</div>
      </Root>
    </Tooltip>
  );
};
export default Select;
