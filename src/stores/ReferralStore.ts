import { makeAutoObservable, runInAction } from "mobx";
import RootStore from "./RootStore";

export interface IReferralData {
  referrer?: string;
  referralCode?: string;
  referralLink?: string;
  isReferralActive: boolean;
}

class ReferralStore {
  public readonly rootStore: RootStore;
  
  // Состояние реферальной системы
  referrer?: string;
  referralCode?: string;
  referralLink?: string;
  isReferralActive: boolean = false;
  isProcessing: boolean = false;

  constructor(rootStore: RootStore, _initState?: any) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
    
    // Инициализация при создании стора
    this.initializeReferral();
  }

  /**
   * Инициализация реферальной системы
   * Загружает сохраненный referrer из localStorage и генерирует ссылку
   */
  initializeReferral = () => {
    this.loadReferrerFromStorage();
    this.generateReferralLink();
  };

  /**
   * Загрузка referrer из localStorage
   */
  loadReferrerFromStorage = () => {
    if (typeof window === "undefined") return;
    
    try {
      const savedReferrer = localStorage.getItem("referrer");
      if (savedReferrer) {
        runInAction(() => {
          this.referrer = savedReferrer;
          this.isReferralActive = true;
        });
      }
    } catch (error) {
      console.error("Error loading referrer from localStorage:", error);
    }
  };

  /**
   * Сохранение referrer в localStorage
   */
  saveReferrerToStorage = (referrer: string) => {
    if (typeof window === "undefined") return;
    
    try {
      localStorage.setItem("referrer", referrer);
      runInAction(() => {
        this.referrer = referrer;
        this.isReferralActive = true;
      });
    } catch (error) {
      console.error("Error saving referrer to localStorage:", error);
    }
  };

  /**
   * Очистка referrer из localStorage
   */
  clearReferrerFromStorage = () => {
    if (typeof window === "undefined") return;
    
    try {
      localStorage.removeItem("referrer");
      runInAction(() => {
        this.referrer = undefined;
        this.isReferralActive = false;
      });
    } catch (error) {
      console.error("Error clearing referrer from localStorage:", error);
    }
  };

  /**
   * Генерация реферальной ссылки для текущего пользователя
   */
  generateReferralLink = () => {
    const { address } = this.rootStore.accountStore;
    
    if (!address) {
      runInAction(() => {
        this.referralLink = undefined;
        this.referralCode = undefined;
      });
      return;
    }

    // Используем адрес кошелька как реферальный код
    const code = address.toLowerCase();
    const link = `https://hits4.fun/?ref=${code}`;
    
    runInAction(() => {
      this.referralCode = code;
      this.referralLink = link;
    });
  };

  /**
   * Обработка реферальной ссылки из URL
   * Вызывается при загрузке страницы для проверки параметра ?ref=
   */
  processReferralFromURL = () => {
    if (typeof window === "undefined") return;
    
    const urlParams = new URLSearchParams(window.location.search);
    const refParam = urlParams.get("ref");
    
    if (refParam) {
      this.saveReferrerToStorage(refParam);
      
      // Очищаем параметр из URL без перезагрузки страницы
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete("ref");
      window.history.replaceState({}, "", newUrl.toString());
    }
  };

  /**
   * Копирование реферальной ссылки в буфер обмена
   */
  copyReferralLink = async (): Promise<boolean> => {
    if (!this.referralLink) return false;
    
    try {
      await navigator.clipboard.writeText(this.referralLink);
      return true;
    } catch (error) {
      console.error("Error copying referral link:", error);
      return false;
    }
  };

  /**
   * Получение данных для отправки на бэкенд
   * Вызывается при авторизации пользователя
   */
  getReferralDataForBackend = (): { referrer?: string } => {
    return {
      referrer: this.referrer,
    };
  };

  /**
   * Проверка, является ли текущий пользователь рефералом
   */
  get isReferral(): boolean {
    return this.isReferralActive && !!this.referrer;
  }

  /**
   * Проверка, может ли пользователь генерировать реферальные ссылки
   */
  get canGenerateReferral(): boolean {
    return this.rootStore.accountStore.isConnected && !!this.rootStore.accountStore.address;
  }

  /**
   * Получение короткого реферального кода для отображения
   */
  get shortReferralCode(): string {
    if (!this.referralCode) return "";
    return `${this.referralCode.slice(0, 6)}...${this.referralCode.slice(-4)}`;
  }

  /**
   * Получение короткого referrer кода для отображения
   */
  get shortReferrerCode(): string {
    if (!this.referrer) return "";
    return `${this.referrer.slice(0, 6)}...${this.referrer.slice(-4)}`;
  }

  /**
   * Установка состояния обработки
   */
  setProcessing = (isProcessing: boolean) => {
    this.isProcessing = isProcessing;
  };

  /**
   * Сброс состояния реферальной системы
   */
  reset = () => {
    runInAction(() => {
      this.referrer = undefined;
      this.referralCode = undefined;
      this.referralLink = undefined;
      this.isReferralActive = false;
      this.isProcessing = false;
    });
    this.clearReferrerFromStorage();
  };
}

export default ReferralStore; 