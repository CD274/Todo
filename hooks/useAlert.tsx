import { useState } from "react";

type AlertType = "info" | "error" | "success";

interface AlertConfig {
  visible: boolean;
  title: string;
  message: string;
  type: AlertType;
}

export const useAlert = () => {
  const [alertConfig, setAlertConfig] = useState<AlertConfig>({
    visible: false,
    title: "",
    message: "",
    type: "info",
  });

  const showAlert = (
    title: string,
    message: string,
    type: AlertType = "info"
  ) => {
    setAlertConfig({
      visible: true,
      title,
      message,
      type,
    });
  };

  const hideAlert = () => {
    setAlertConfig((prev) => ({ ...prev, visible: false }));
  };

  return {
    alertConfig,
    showAlert,
    hideAlert,
  };
};
