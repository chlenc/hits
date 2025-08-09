import styled from "@emotion/styled";

const Button = styled.button<{secondary?: boolean}>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  border-radius: 45px;
  cursor: pointer;
  background: ${({ secondary }) => 
    secondary 
      ? "#39383A" 
      : "linear-gradient(114deg, #e478fe 17.57%, #9a45fe 81.44%)"
  };
  border: none;
  font-family: "Instrument Sans";
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 150%; /* 27px */
  letter-spacing: -0.36px;  
  width: 100%;
  box-sizing: border-box;
  color: #fff;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: #4E4C51;
  }
`;

export default Button;
