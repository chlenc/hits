import { makeAutoObservable, runInAction } from "mobx";
import RootStore from "./RootStore";
import { toast } from "react-toastify";
import { apiService, type Invoice } from "../services/api";

export interface ISerializedInvoiceStore {
  invoiceData: InvoiceData | null;
}
interface InvoiceData extends Invoice {
  network: string;
  token: string;
}

//store about invoice and payment processing
class InvoiceStore {
  rootStore: RootStore;
  isModalOpen: boolean = false;
  invoiceData: InvoiceData | null = null;

  private statusCheckInterval: NodeJS.Timeout | null = null;

  constructor(rootStore: RootStore, initialState?: ISerializedInvoiceStore) {
    this.rootStore = rootStore;
    if (initialState) {
      this.invoiceData = initialState.invoiceData;
      this.isModalOpen = true;
      if (
        !initialState.invoiceData?.redirectData &&
        !this.statusCheckInterval
      ) {
        this.startStatusChecking();
      }
    }
    makeAutoObservable(this);
  }

  // Create new invoice
  async createInvoice(
    amount: number,
    network: string,
    token: string
  ): Promise<InvoiceData | null> {
    try {
      const { address, signatures } = this.rootStore.accountStore;
      if (!address || !signatures[address]) {
        throw new Error("No address or signature found");
      }
      const response = await apiService.createInvoice(
        signatures[address],
        address,
        { network, token, amount }
      );

      const invoiceData: InvoiceData = {
        ...response,
        network,
        token,
      };

      console.log("invoiceData", invoiceData);
      runInAction(() => {
        this.invoiceData = invoiceData;
        this.isModalOpen = true;
      });

      // If we have redirect data, we don't need to start status checking
      if (!response.redirectData) {
        this.startStatusChecking();
      }

      return invoiceData;
    } catch (error) {
      console.error("Error creating invoice:", error);
      toast.error(`Failed to create payment invoice: ${error}`);
      return null;
    }
  }

  // Start payment status checking
  private startStatusChecking() {
    if (this.statusCheckInterval) {
      clearInterval(this.statusCheckInterval);
    }

    this.statusCheckInterval = setInterval(() => {
      this.checkPaymentStatus();
    }, 10000); // Check every 10 seconds
  }

  // Check payment status
  private async checkPaymentStatus() {
    const { address, signatures } = this.rootStore.accountStore;
    if (!address || !signatures[address]) {
      throw new Error("No address or signature found");
    }
    if (
      !this.invoiceData ||
      this.invoiceData.paymentStatus === "finished" ||
      this.invoiceData.paymentStatus === "expired"
    ) {
      this.stopStatusChecking();
      return;
    }

    try {
      const response = await apiService.getInvoice(
        signatures[address],
        address,
        this.invoiceData.paymentId
      );

      runInAction(() => {
        if (this.invoiceData) {
          this.invoiceData.paymentStatus = response.paymentStatus;
          // if (response.txHash) {
          //   this.invoiceData.txHash = response.txHash;
          // }

          if (response.paymentStatus === "finished") {
            toast.success("Payment completed successfully!");
            this.stopStatusChecking();
          } else if (response.paymentStatus === "failed") {
            toast.error("Payment failed");
            this.stopStatusChecking();
          } else if (response.paymentStatus === "expired") {
            toast.error("Payment time has expired");
            this.stopStatusChecking();
          }
        }
      });
    } catch (error) {
      console.error("Error checking payment status:", error);
    }
  }

  // Stop status checking
  private stopStatusChecking() {
    if (this.statusCheckInterval) {
      clearInterval(this.statusCheckInterval);
      this.statusCheckInterval = null;
    }
  }

  openModal = (payload: InvoiceData) => {
    this.invoiceData = payload;
    this.isModalOpen = true;
    if (!payload.redirectData) {
      this.startStatusChecking();
    }
  };

  closeModal = () => {
    this.isModalOpen = false;
    this.invoiceData = null;
    this.stopStatusChecking();
  };

  // Cleanup when component unmounts
  dispose() {
    this.stopStatusChecking();
  }

  serialize = () => {
    return {
      invoiceData: this.invoiceData,
    };
  };
}

export default InvoiceStore;
