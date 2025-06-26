import { useConnectModal } from "@rainbow-me/rainbowkit";
function TestConnect() {
  const { openConnectModal } = useConnectModal();
  return (
    <button onClick={() => openConnectModal?.()}>
      Test RainbowKit Modal
    </button>
  );
}
export default TestConnect;