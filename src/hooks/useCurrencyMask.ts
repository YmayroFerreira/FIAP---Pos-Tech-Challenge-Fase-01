import { useEffect, useState } from "react";
import IMask from "imask";

export function useCurrencyMask(
  inputRef: React.RefObject<HTMLInputElement | null>
) {
  const [maskedValue, setMaskedValue] = useState("");
  const [numericValue, setNumericValue] = useState<number | null>(null);

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
    });

    mask.on("accept", () => {
      setMaskedValue(mask.value);
      const raw = mask.unmaskedValue;
      setNumericValue(raw ? Number(raw) / 100 : null);
    });

    return () => mask.destroy();
  }, [inputRef]);

  return { maskedValue, numericValue };
}
