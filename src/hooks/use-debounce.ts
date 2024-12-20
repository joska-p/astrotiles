import { useTimeout } from "@/hooks/use-timeout";
import { useEffect } from "react";

const useDebounce = (
  callback: (...args: unknown[]) => unknown,
  delay: number,
  dependencies: React.DependencyList
): void => {
  const { reset, clear } = useTimeout(callback, delay);
  useEffect(reset, [...dependencies, reset]);
  useEffect(clear, []);
};

export { useDebounce };
