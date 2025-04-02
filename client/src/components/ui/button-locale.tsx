import { useTranslation } from "react-i18next";
import brasilFlag from "../../assets/brasilia.png";
import usaFlag from "../../assets/usa.png";

type Props = {
  toggleLanguage: () => void;
};

export function ButtonLocale({ toggleLanguage }: Props) {
  const { i18n } = useTranslation();

  return (
    <button
      onClick={toggleLanguage}
      className="cursor-pointer rounded-full overflow-hidden p-1"
    >
      <img
        src={i18n.language === "pt" ? brasilFlag : usaFlag}
        alt="Idioma"
        className="w-8 h-8"
      />
    </button>
  );
}
