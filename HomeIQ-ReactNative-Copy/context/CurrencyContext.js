// context/CurrencyContext.js
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CURRENCY_KEY = "@preferred_currency";
const CurrencyContext = createContext(null);

export function CurrencyProvider({ children, initial = "ZAR" }) {
  const [currency, setCurrency] = useState(initial);

  // Load from storage (and fall back to ZAR)
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(CURRENCY_KEY);
        if (saved) setCurrency(saved);
      } catch {}
    })();
  }, []);

  // Save to storage on change
  useEffect(() => {
    AsyncStorage.setItem(CURRENCY_KEY, currency).catch(() => {});
  }, [currency]);

  // Friendly label & symbol
  const label = useMemo(() => {
    const map = {
      ZAR: { label: "South African Rand (ZAR)", symbol: "R" },
      USD: { label: "US Dollar (USD)", symbol: "$" },
      EUR: { label: "Euro (EUR)", symbol: "€" },
      GBP: { label: "British Pound (GBP)", symbol: "£" },
      // add more here as needed
    };
    return map[currency] ?? { label: currency, symbol: "" };
  }, [currency]);

  // App-wide formatter
  const formatMoney = (value, opts = {}) => {
    try {
      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency,
        maximumFractionDigits: opts.maxFractionDigits ?? 2,
        minimumFractionDigits: opts.minFractionDigits ?? 0,
      }).format(value ?? 0);
    } catch {
      // Fallback if Intl/currency not supported
      return `${label.symbol}${Number(value ?? 0).toFixed(opts.fallbackDigits ?? 2)}`;
    }
  };

  const value = { currency, setCurrency, formatMoney, label };

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    Alert.alert("CurrencyContext missing", "Wrap your app in <CurrencyProvider />");
  }
  return ctx || { currency: "ZAR", setCurrency: () => {}, formatMoney: v => `R${v}`, label: { symbol: "R" } };
}
