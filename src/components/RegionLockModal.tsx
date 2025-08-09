import { observer } from "mobx-react-lite";
import regionLockImage from "../assets/images/regionLock.webp";
import { useStores } from "../stores/useStores";
import Modal from "./Modal";
import { useNavigate } from "react-router-dom";

const RegionLockModal = observer(() => {
  const { accountStore } = useStores();
  const navigate = useNavigate();
  if (!accountStore.isCompliance) {
    return null;
  }

  return (
    <Modal
      open={true}
      onOpenChange={() => navigate("/trades")}
      image={regionLockImage}
      title="Not available in your region"
      subtitle="We’re working to bring HITS to more countries."
      btnText="Got it"
      onClick={() => navigate("/trades")}
    />
  );
});

export default RegionLockModal;
