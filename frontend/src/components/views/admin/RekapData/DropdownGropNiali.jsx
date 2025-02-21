import KelasDropdown from "@/components/elements/KelasDropdown";
import NamaKelasDropdown from "@/components/elements/NamaKelasDropdown";
import DropdownTahunAjaran from "@/components/elements/DropdownTahunAjaran";
import DropdownSemester from "@/components/elements/DropdownSemester";
import { useTranslation } from 'react-i18next';

export const DropdownGropNiali = ({
  handleSelectSemester,
  onSelectIdKelas,
  onSelectKelas,
  handleSelectAjaran,
  kelas,
}) => {
  const { t } = useTranslation();
  
  return (
    <div className="grid justify-center  xl:flex xl:flex-wrap xl:justify-start gap-4">
      <div className=" grid grid-cols-2 gap-2 xl:flex items-center">
        <label htmlFor="ajaran" className="text-sm font-semibold text-gray-700">
          {t('forms.dataClasses.labels.academicYear')}
        </label>
        <DropdownTahunAjaran onSelectAjaran={handleSelectAjaran} />
      </div>
      <div className=" grid grid-cols-2 gap-2 xl:flex items-center">
        <label className="text-sm font-semibold text-gray-700">
          {t('forms.dataClasses.labels.semester')}
        </label>
        <DropdownSemester onSelectedSemester={handleSelectSemester} />
      </div>
      <div className=" grid grid-cols-2 gap-2 xl:flex items-center">
        <label htmlFor="kelas" className="text-sm font-semibold text-gray-700">
          {t('forms.dataClasses.labels.level')}
        </label>
        <KelasDropdown onChange={onSelectKelas} />
      </div>
      <div className=" grid grid-cols-2 gap-2 xl:flex items-center">
        <label
          htmlFor="namaKelas"
          className="text-sm font-semibold text-gray-700"
        >
          {t('forms.dataClasses.labels.className')}
        </label>
        <NamaKelasDropdown onChange={onSelectIdKelas} kelas={kelas} />
      </div>
    </div>
  );
};
