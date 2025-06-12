import styled from "@emotion/styled";
import background from "../assets/images/landing.png";

const Container = styled.div`
  min-height: 100vh;
  height: 100%;
  width: 100%;
  max-width: 420px;
`;

const Background = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Main: React.FC = () => {
  return (
    <Container>
      <Background src={background} alt="background" />
    </Container>
  );
};

export default Main;
