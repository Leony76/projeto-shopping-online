import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext";

export const toastAppearOnce = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    if (location.state?.toast) {
      const { message, type } = location.state.toast;

      showToast(message, type);

      navigate(".", { replace: true, state: null });
    }
  }, []);
}
