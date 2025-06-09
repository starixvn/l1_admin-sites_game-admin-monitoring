import React from "react";

type Props = {
  onMessage: Function;
  sendMessage: Function;
  isProduction: boolean;
  partners: Array<string>;
};

export default function MiniRouletteRedirect(props: Props) {
  if (typeof window !== 'undefined') {
    window.location.href = "/ResultMonitor/MiniRouletteResult";
  }

  return null;
} 