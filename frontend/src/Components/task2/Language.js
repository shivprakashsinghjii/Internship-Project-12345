import React from "react";
import { useTranslation } from "react-i18next";
import LanguageSelector from "./LanguageSelector";
import i18n from "i18next"; // Importing i18n to access the current language

const Language = () => {
  const { t } = useTranslation();
  const isWhiteText = i18n.language === "hi" || i18n.language === "zh"; // Evaluate this inside the component

  return (
    <div className="container">
      <LanguageSelector />
      <h1
        className={`text-sm mb-4 ${
          isWhiteText ? "text-white" : "text-gray-600"
        }`}
      >
        {t("greeting")}
      </h1>
    </div>
  );
};

export default Language;
