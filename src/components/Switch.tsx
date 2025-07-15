import React, { useState } from "react";

interface SwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
}

const Switch: React.FC<SwitchProps> = ({ checked, onChange, disabled }) => {
  const [internalChecked, setInternalChecked] = useState(false);
  const isChecked = checked !== undefined ? checked : internalChecked;

  const handleToggle = () => {
    if (disabled) return;
    if (onChange) {
      onChange(!isChecked);
    } else {
      setInternalChecked((prev) => !prev);
    }
  };

  // Определяем фон в зависимости от состояния
  const background = disabled
    ? "#6F6F70"
    : isChecked
    ? "linear-gradient(114deg, #19F096 17.57%, #0092AE 81.44%)"
    : "#6F6F70";

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={disabled}
      aria-checked={isChecked}
      role="switch"
      style={{
        position: "relative",
        display: "flex",
        width: 48,
        height: 24,
        padding: 2,
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 2,
        border: "none",
        outline: "none",
        borderRadius: 16,
        background,
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "background 0.3s cubic-bezier(.4,0,.2,1)",
      }}
    >
      <span
        style={{
          position: "absolute",
          left: isChecked ? 24 : 2,
          top: 2,
          width: 20,
          height: 20,
          borderRadius: 14,
          background: "#FFF",
          boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
          transition: "left 0.2s cubic-bezier(.4,0,.2,1), background 0.2s",
        }}
      />
    </button>
  );
};

export default Switch;
