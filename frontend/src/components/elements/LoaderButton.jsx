import { ClipLoader } from "react-spinners";
import { useTranslation } from "react-i18next";

const LoaderButton = () => {
  const { t } = useTranslation();
  
  return (
    <span className="flex items-center justify-center gap-2">
      <ClipLoader size={20} color="#ffffff" /> {t("common.loading")}
    </span>
  );
};

export default LoaderButton;
