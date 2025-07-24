import { useState, useEffect } from "react";
import updateCountdown from "../utils/updateCountdown";

const useCountdown = (props: {
  depositUntil?: string;
  expiration?: string;
}) => {
  const { depositUntil, expiration } = props;
  const [startsIn, setStartsIn] = useState("");
  const [activeUntil, setActiveUntil] = useState("");
  useEffect(() => {
    if (depositUntil) updateCountdown(depositUntil, setStartsIn);
    if (expiration) updateCountdown(expiration, setActiveUntil);
    const interval = setInterval(() => {
      if (depositUntil) updateCountdown(depositUntil, setStartsIn);
      if (expiration) updateCountdown(expiration, setActiveUntil);
    }, 1000 * 60);
    return () => clearInterval(interval);
  }, [depositUntil, expiration]);

  return { startsIn, activeUntil };
};

export default useCountdown;
