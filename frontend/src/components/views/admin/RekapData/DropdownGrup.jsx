import KelasDropdown from "@/components/elements/KelasDropdown";
import NamaKelasDropdown from "@/components/elements/NamaKelasDropdown";
import MonthDropdown from "@/components/elements/MonthDropdown";
import YearDropdown from "@/components/elements/YearDropDown";
import { useTranslation } from "react-i18next";

const DropdownGroup = ({
  handleSelectYear,
  handleSelectMonth,
  onSelectKelas,
  onSelectIdKelas,
  kelas,
}) => {
  const { t } = useTranslation();

  return (
    <div className="grid md:flex gap-4">
      <div className="flex flex-wrap justify-start gap-4">
        <div className="flex items-center gap-2">
          <label
            htmlFor="tahun"
            className="text-sm font-semibold text-gray-700"
          >
            {t('common.time.year')}
          </label>
          <YearDropdown onSelectYear={handleSelectYear} />
        </div>
        <div className="flex items-center gap-2">
          <label
            htmlFor="bulan"
            className="text-sm font-semibold text-gray-700"
          >
            {t('common.time.month')}
          </label>
          <MonthDropdown onSelectMonth={handleSelectMonth} />
        </div>

        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-gray-700">{t('forms.dataClasses.labels.level')}</p>
          <KelasDropdown onChange={onSelectKelas} />
        </div>
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-gray-700 w-fit">{t('forms.dataClasses.labels.className')}</p>
          <NamaKelasDropdown onChange={onSelectIdKelas} kelas={kelas} />
        </div>
      </div>
    </div>
  );
};

export default DropdownGroup;
