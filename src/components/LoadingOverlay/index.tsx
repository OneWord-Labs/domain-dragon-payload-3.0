import React from "react";

const baseClass = "loading-overlay";

type Props = {
  animationDuration?: string;
  loadingText?: string;
  overlayType?: string;
  show?: boolean;
};

export const LoadingOverlay: React.FC<Props> = ({
  animationDuration,
  loadingText,
  overlayType,
  show = true,
}) => {
  return (
    <div
      className={[
        baseClass,
        show ? `${baseClass}--entering` : `${baseClass}--exiting`,
        overlayType ? `${baseClass}--${overlayType}` : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        animationDuration: animationDuration || "500ms",
      }}
    >
      <div className={`${baseClass}__bars`}>
        <div className={`${baseClass}__bar`} />
        <div className={`${baseClass}__bar`} />
        <div className={`${baseClass}__bar`} />
        <div className={`${baseClass}__bar`} />
        <div className={`${baseClass}__bar`} />
      </div>

      <span className={`${baseClass}__text`}>{loadingText || "loading"}</span>
    </div>
  );
};
