import React from "react";
import { Button, Dialog, Portal, Text, useTheme } from "react-native-paper";

type AlertType = "info" | "error" | "success";

interface CustomAlertProps {
  visible: boolean;
  title: string;
  message: string;
  type: AlertType;
  onDismiss: () => void;
}

const CustomAlert: React.FC<CustomAlertProps> = ({
  visible,
  title,
  message,
  type,
  onDismiss,
}) => {
  const theme = useTheme();

  const alertStyles = {
    info: {
      backgroundColor: "#2D4A53",
      textColor: "#AFB3B7",
      icon: "information",
    },
    error: {
      backgroundColor: "#a4262c",
      textColor: "#FFFFFF",
      icon: "alert-circle",
    },
    success: {
      backgroundColor: "#146748",
      textColor: "#FFFFFF",
      icon: "check-circle",
    },
  };

  const currentStyle = alertStyles[type];

  return (
    <Portal>
      <Dialog
        visible={visible}
        onDismiss={onDismiss}
        style={{
          backgroundColor: currentStyle.backgroundColor,
          borderRadius: 12,
        }}
      >
        <Dialog.Title>
          <Text
            style={{
              color: currentStyle.textColor,
              fontWeight: "600",
              fontSize: 18,
            }}
          >
            {title}
          </Text>
        </Dialog.Title>
        <Dialog.Content>
          <Text style={{ color: currentStyle.textColor, fontSize: 15 }}>
            {message}
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            onPress={onDismiss}
            textColor={currentStyle.textColor}
            style={{ marginRight: 8 }}
          >
            Aceptar
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default CustomAlert;
