// useActivityDetection.ts
import { useEffect } from "react";

const useActivityDetection = (onActivity: () => void): void => {
  useEffect(() => {
    const handleActivity = () => {
      onActivity();
    };

    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);

    return () => {
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
    };
  }, [onActivity]);
};

export default useActivityDetection;
