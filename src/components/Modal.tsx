import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import styled from "@emotion/styled";
import closeIcon from "../assets/icons/close.svg";

interface IModalProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  image: string;
  title: string;
  subtitle: string;
  btnText: string;
  onClick: () => void;
}

function Modal(props: IModalProps) {
  const { open, onOpenChange, image, title, subtitle, btnText, onClick } =
    props;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Overlay
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => onOpenChange(false)}
            />

            <ContentWrapper
              style={{ x: "-50%", y: "-50%" }}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
            >
              <Content>
                <Close aria-label="Close">
                  <img src={closeIcon} alt="close" />
                </Close>
                <Image src={image} alt="" />
                <Title>{title}</Title>
                <Description>{subtitle}</Description>
                <Button onClick={onClick}>{btnText}</Button>
              </Content>
            </ContentWrapper>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
export default Modal;

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(34, 32, 36, 0.8);
  z-index: 3;
`;

const ContentWrapper = styled(motion.div)`
  position: fixed;
  left: 50%;
  top: 50%;
  z-index: 4;
  padding: 0 16px;
  box-sizing: border-box;
`;

const Content = styled(ContentWrapper)`
  width: min(92vw, 480px);
  background: #000;
  border-radius: 28px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 2px solid #222024;

  transform: translate(-50%, -50%);
`;

const Close = styled(Dialog.Close)`
  position: absolute;
  right: 16px;
  top: 16px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 20px;
  cursor: pointer;
  background: none;
  border: none;
  &:hover {
    color: white;
  }
`;

const Image = styled.img`
  width: 260px;
  height: 160px;
  margin-top: 8px;
  margin-bottom: 12px;
  object-fit: contain;
`;

const Title = styled(Dialog.Title)`
  color: white;
  font-size: 28px;
  line-height: 34px;
  text-align: center;
  font-weight: 600;
  margin-top: 8px;
`;

const Description = styled(Dialog.Description)`
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
  margin-top: 10px;
  margin-bottom: 18px;
  font-size: 15px;
`;

const Button = styled.button`
  width: 100%;
  border-radius: 22px;
  padding: 14px;
  font-size: 18px;
  font-weight: 700;
  color: white;
  background: linear-gradient(90deg, #c868ff, #7b5cff);
  border: none;
  cursor: pointer;
  &:active {
    opacity: 0.9;
  }
`;
