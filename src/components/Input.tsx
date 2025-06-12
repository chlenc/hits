import styled from "@emotion/styled";

const Input = styled.input`
  display: flex;
  flex-direction: column;
  position: relative;

  border-radius: 32px;
  padding: 0 16px;
  height: 64px;
  box-sizing: border-box;
  border: 2px solid transparent;
  border-radius: 32px;

  font-family: "Instrument Sans";
  font-size: 28px;
  font-style: normal;
  font-weight: 500;
  line-height: 110%; /* 30.8px */
  letter-spacing: -0.28px;
  text-align: center;
  
  /* слой 1 — заливка, слой 2 — градиент */
  background-image: linear-gradient(#000, #000),
    /* fill   */ linear-gradient(135deg, #19f096 0%, #6aacff 60%, #8f4af5 100%); /* border */

  /* говорим, где рисовать слои */
  background-origin: padding-box, border-box;
  background-clip: padding-box, border-box;

  &::placeholder {
    color: #6f6f70;
  }

  &:focus {
    outline: none;
  }

  &:hover {
  }
`;

export default Input;
