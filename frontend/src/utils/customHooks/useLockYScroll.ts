import { useEffect } from "react";

export const useLockYScroll = (flag:boolean) => {
  useEffect(() => {
    if (flag) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [flag]);
}