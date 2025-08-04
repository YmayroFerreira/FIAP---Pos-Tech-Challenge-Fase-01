import { useEffect, useState, useCallback } from "react";
import IMask from "imask";

interface IMaskInstance {
  value: string;
  unmaskedValue: string;
  destroy: () => void;
  on: (event: string, callback: () => void) => void;
}

export function useCurrencyMask(
  inputRef: React.RefObject<HTMLInputElement | null>
) {
  const [maskedValue, setMaskedValue] = useState("");
  const [numericValue, setNumericValue] = useState<number | null>(null);
  const [maskInstance, setMaskInstance] = useState<IMaskInstance | null>(null);

  useEffect(() => {
    if (!inputRef.current) return;

    const mask = IMask(inputRef.current, {
      mask: Number,
      scale: 2,
      signed: false,
      thousandsSeparator: ".",
      padFractionalZeros: true,
      normalizeZeros: true,
      radix: ",",
      mapToRadix: ["."],
      prefix: "R$ ",
      lazy: false,
    }) as IMaskInstance;

    setMaskInstance(mask);

    mask.on("accept", () => {
      setMaskedValue(mask.value);
      const raw = mask.unmaskedValue;
      setNumericValue(raw ? Number(raw) : null);
    });

    return () => mask.destroy();
  }, [inputRef]);

  const setValue = useCallback(
    (value: number) => {
      if (maskInstance && inputRef.current) {
        maskInstance.unmaskedValue = value.toString();
      }
    },
    [maskInstance, inputRef]
  );

  return { maskedValue, numericValue, setValue };
}
