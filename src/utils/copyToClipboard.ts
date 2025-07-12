export const copyToClipboard = async (value?: string): Promise<boolean> => {
    if (!value) return false;
  
    try {
      await navigator.clipboard.writeText(value);
      return true;
    } catch (error) {
      console.error("Error copying referral link:", error);
      return false;
    }
  };