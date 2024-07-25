import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const languages = [
  { code: "en", lang: "English" },
  { code: "es", lang: "Spanish" },
  { code: "hi", lang: "Hindi" },
  { code: "pt", lang: "Portuguese" },
  { code: "zh", lang: "Chinese" },
  { code: "fr", lang: "French" },
];

const LanguageSelector = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const changeLanguageFunction = (languageCode) => {
    // Navigate to /phone with selected language in state
    navigate("/phone", { state: { selectedLanguage: languageCode } });
  };

  return (
    <div className="btn-container flex flex-wrap justify-center gap-2 md:gap-4 my-4">
      {languages.map((language) => (
        <LanguageButton
          key={language.code}
          code={language.code}
          lang={t(language.lang)}
          changeLanguage={() => changeLanguageFunction(language.code)}
        />
      ))}
    </div>
  );
};

const LanguageButton = ({ code, lang, changeLanguage }) => (
  <button
    onClick={changeLanguage}
    className="w-full md:w-auto px-4 py-2 md:px-6 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
    style={{ marginInline: "20px" }}
  >
    {lang}
  </button>
);

export default LanguageSelector;
