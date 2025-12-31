export type UIFlags = {
  showProductInfo: boolean;
  showProductAmount: boolean;
  showConfirmPurchase: boolean;
  showConfirmSuggestion: {
    accept: boolean;
    deny: boolean;
  };
  processingState: boolean;
  closeEditModal: boolean;
  isLoading: boolean;
}