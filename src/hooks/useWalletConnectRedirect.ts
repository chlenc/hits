import { useEffect, useState } from "react";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useNavigate } from "react-router-dom";
import { useStores } from "../stores/useStores";

interface UseWalletConnectRedirectOptions {
  redirectPath?: string;
  autoOpenModal?: boolean;
}

export const useWalletConnectRedirect = (
  options: UseWalletConnectRedirectOptions = {}
) => {
  const { redirectPath = "/strategies", autoOpenModal = true } = options;
  const { accountStore } = useStores();
  const { openConnectModal, connectModalOpen } = useConnectModal();
  const navigate = useNavigate();
  const [wasModalOpened, setWasModalOpened] = useState(false);

  // Проверяем подключение кошелька при загрузке компонента
  useEffect(() => {
    if (!accountStore.isConnected && autoOpenModal) {
      // Если кошелек не подключен, открываем модалку подключения
      if (openConnectModal) {
        openConnectModal();
        setWasModalOpened(true);
      }
    }
  }, [accountStore.isConnected, openConnectModal, autoOpenModal]);

  // Следим за закрытием модалки
  useEffect(() => {
    if (
      wasModalOpened &&
      connectModalOpen === false &&
      !accountStore.isConnected
    ) {
      // Модалка была открыта и теперь закрыта, но кошелек не подключен
      navigate(redirectPath);
    }
  }, [
    connectModalOpen,
    wasModalOpened,
    accountStore.isConnected,
    navigate,
    redirectPath,
  ]);

  // Функция для ручного открытия модалки
  const openModal = () => {
    if (openConnectModal) {
      openConnectModal();
      setWasModalOpened(true);
    }
  };

  return {
    isConnected: accountStore.isConnected,
    openModal,
    wasModalOpened,
  };
};
