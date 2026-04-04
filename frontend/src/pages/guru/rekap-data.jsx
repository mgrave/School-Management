import { useTranslation } from 'react-i18next';
import RekapAbsenFragment from "@/components/views/guru/rekap/RekapAbsenFragment";
import RekapNilaiFragment from "@/components/views/guru/rekap/RekapNilaiFragement";
import RekapNilaiStudiFragment from "@/components/views/guru/rekap/RekapNilaiStudiFragment";
import { selectedUserData } from "@/store/slices/auth-slice";
import { useState } from "react";
import { useSelector } from "react-redux";

const RekapDataPage = () => {
  const { t } = useTranslation();
  const userData = useSelector(selectedUserData);
  const fragment = userData.waliKelas
    ? [t('rekapData.attendance'), t('rekapData.reportCard'), t('rekapData.studyGrades')]
    : [t('rekapData.studyGrades')];
  const [selectedFragment, setSelectedFragment] = useState(fragment[0]);

  return (
    <section className="px-6 py-4 mb-4 ">
      <div className="mb-10  bg-white  shadow-md flex  border-t-4 border-blue-800 py-4">
        {fragment.map((frag, i) => (
          <button
            key={i}
            onClick={() => setSelectedFragment(frag)}
            className={`${
              selectedFragment === frag
                ? "bg-neutral text-white"
                : "bg-white text-neutral"
            } text-xs sm:text-sm  border-gray-50 border-b w-[33.3%] md:w-[20%]  py-1.5 `}
          >
            {frag}
          </button>
        ))}
      </div>
      {selectedFragment === t('rekapData.attendance') && <RekapAbsenFragment />}
      {selectedFragment === t('rekapData.reportCard') && <RekapNilaiFragment />}
      {selectedFragment === t('rekapData.studyGrades') && <RekapNilaiStudiFragment />}
    </section>
  );
};

export default RekapDataPage;

////////////////////////////////////////
