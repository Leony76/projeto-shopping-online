import axios from "axios";
import { useToast } from "../../context/ToastContext";

export const useCatchError = () => {
  const { showToast } = useToast();

  return(err:unknown) => {
    if (axios.isAxiosError(err) && err.response?.data?.message) {
      showToast(err.response.data.message, "error");
    } else {
      showToast("Erro inesperado", "error");
    }
  }
}