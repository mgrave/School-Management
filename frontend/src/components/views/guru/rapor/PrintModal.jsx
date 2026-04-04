import React from "react";
import logo from "../../../../assets/Schoolarcy (2).webp";
import { useTranslation } from "react-i18next";

const PrintComponent = React.forwardRef(
  ({ dataRapor, average, totalAbsen, dataMapel }, ref) => {
    const { t } = useTranslation();

    return (
      <div
        ref={ref}
        className="relative bg-white r mt-4 text-gray-900   mx-auto page-potrait"
      >
        <div className="p-4 md:p-8">
          <div className="flex justify-center border-b-2 border-double border-gray-700 py-10">
            <img
              src={logo}
              alt="Logo"
              className="w-[150px] h-[30px] md:w-[180px] md:h-[35px]"
            />
          </div>
          <div className="border-t border-gray-700 mt-2 "></div>
          <div className="grid grid-cols-4 mt-10">
            <div className="col-span-2 space-y-2">
              <div className="flex text-[0.5rem] sm:text-[0.625rem] md:text-xs gap-2">
                <p className="min-w-[30px] md:min-w-[80px] font-medium">
                  {t('reportCard.studentName')}
                </p>
                <span>:</span>
                <p className="font-medium">{dataRapor?.nama}</p>
              </div>
              <div className="flex text-[0.5rem] sm:text-[0.625rem] md:text-xs gap-2">
                <p className="min-w-[30px] md:min-w-[80px] font-medium">
                  {t('common.nis')}
                </p>
                <span>:</span>
                <p className="font-medium">{dataRapor?.nis}</p>
              </div>
              <div className="flex text-[0.5rem] sm:text-[0.625rem] md:text-xs gap-2">
                <p className="min-w-[30px] md:min-w-[80px] font-medium">
                  {t('class.homeroom_teacher')}
                </p>
                <span>:</span>
                <p className="font-medium">{dataRapor?.waliKelas}</p>
              </div>
            </div>
            <div className="col-span-2 space-y-2">
              <div className="flex text-[0.5rem] sm:text-[0.625rem] md:text-xs gap-2">
                <p className="min-w-[30px] md:min-w-[80px] font-medium">
                  {t('common.class')}
                </p>
                <span>:</span>
                <p className="font-medium">{dataRapor?.kelas}</p>
              </div>
              <div className="flex text-[0.5rem] sm:text-[0.625rem] md:text-xs gap-2">
                <p className="min-w-[30px] md:min-w-[80px] font-medium">
                  {t('common.academicYear')}
                </p>
                <span>:</span>
                <p className="font-medium">{dataRapor?.ajaran}</p>
              </div>
              <div className="flex text-[0.5rem] sm:text-[0.625rem] md:text-xs gap-2">
                <p className="min-w-[30px] md:min-w-[80px] font-medium">
                  {t('common.semester')}
                </p>
                <span>:</span>
                <p className="font-medium">
                  {dataRapor?.semester?.split("semester").join(" ")}
                </p>
              </div>
            </div>
          </div>
          <div className=" mt-10 border-gray-600">
            <table className="text-[0.5rem] w-full sm:text-[0.625rem] md:text-xs">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="px-4 py-2 w-[10%] text-center font-medium border border-gray-600"
                  >
                    No.
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-2 w-[40%] font-medium border border-gray-600"
                  >
                    {t('common.subject')}
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-2 w-[25%] text-center font-medium border border-gray-600"
                  >
                    {t('common.assignment')}
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-2 w-[25%] text-center font-medium border border-gray-600"
                  >
                    {t('common.exam')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {dataRapor?.length === 0 && (
                  <tr>
                    <td
                      scope="row"
                      className="px-4 py-1 w-[10%] text-center  font-medium border border-gray-600"
                    >
                      1
                    </td>
                    <td
                      scope="row"
                      className="px-4 py-1 w-[40%]  font-medium border border-gray-600"
                    >
                      B.Indonesia
                    </td>

                    <td
                      scope="row"
                      className="px-4 py-1 w-[25%] text-center font-medium border border-gray-600"
                    >
                      0
                    </td>
                    <td
                      scope="row"
                      className="px-4 py-1 w-[25%] text-center font-medium border border-gray-600"
                    >
                      0
                    </td>
                  </tr>
                )}
                {dataRapor && dataRapor?.nilai?.length === 0 && (
                  <tr>
                    <td
                      scope="row"
                      colSpan={4}
                      className="px-4 py-1 text-center   font-medium border border-gray-600"
                    >
                      Tidak memiliki nilai.
                    </td>
                  </tr>
                )}
                {dataMapel.map((mapel, i) => {
                  const nilaiTugas = dataRapor.nilai.find(
                    (item) => item.mapel === mapel && item.kategori === "tugas"
                  );
                  const nilaiUjian = dataRapor.nilai.find(
                    (item) => item.mapel === mapel && item.kategori === "ujian"
                  );

                  return (
                    <tr key={i + 1}>
                      <td
                        scope="row"
                        className="px-4 py-1 text-center w-[10%] font-medium border border-gray-600"
                      >
                        {i + 1}
                      </td>
                      <td
                        scope="row"
                        className="px-4 py-1 w-[40%] font-medium border border-gray-600"
                      >
                        {mapel}
                      </td>

                      <td
                        scope="row"
                        className="px-4 py-1 w-[25%] text-center font-medium border border-gray-600"
                      >
                        {nilaiTugas ? nilaiTugas.nilai : 0}
                      </td>
                      <td
                        scope="row"
                        className="px-4 py-1 w-[25%] text-center font-medium border border-gray-600"
                      >
                        {nilaiUjian ? nilaiUjian.nilai : 0}
                      </td>
                    </tr>
                  );
                })}
                <tr>
                  <td
                    scope="row"
                    colSpan={2}
                    className="px-4 py-1 w-[50%]  font-medium border border-gray-600"
                  >
                    {t('tableNilai.average')}
                  </td>
                  <td
                    scope="row"
                    className="px-4 py-1 w-[25%] text-center font-medium border border-gray-600"
                  >
                    {Math.round(average.tugasAverage * 10) / 10}
                  </td>
                  <td
                    scope="row"
                    className="px-4 py-1 w-[25%] text-center font-medium border border-gray-600"
                  >
                    {Math.round(average.ujianAverage * 10) / 10}
                  </td>
                </tr>
                <tr>
                  <td
                    scope="row"
                    colSpan={2}
                    className="px-4 py-1 w-[50%]  font-medium border border-gray-600"
                  >
                    {t('reportCard.gradeSummary')}
                  </td>
                  <td
                    scope="row"
                    colSpan={2}
                    className="px-4 py-1 w-[25%] text-center font-medium border border-gray-600"
                  >
                    {Math.round(average.overallAverage * 10) / 10}
                  </td>
                </tr>
                <tr className="border-none">
                  <td colSpan={4} className="border-none py-4"></td>
                </tr>
                <tr>
                  <td
                    scope="row"
                    colSpan={2}
                    rowSpan={3}
                    className="px-4 py-1 w-[50%] text-center font-medium border border-gray-600"
                  >
                    {t('reportCard.absence')}
                  </td>
                  <td
                    scope="row"
                    className="px-4 py-1 w-[25%] text-center font-medium border border-gray-600"
                  >
                    {t('attendance.status.izin')}
                  </td>
                  <td
                    scope="row"
                    className="px-4 py-1 w-[25%] text-center font-medium border border-gray-600"
                  >
                    {totalAbsen.izin}
                  </td>
                </tr>
                <tr>
                  <td
                    scope="row"
                    className="px-4 py-1 w-[25%] text-center font-medium border border-gray-600"
                  >
                    {t('attendance.status.sakit')}
                  </td>
                  <td
                    scope="row"
                    className="px-4 py-1 w-[25%] text-center font-medium border border-gray-600"
                  >
                    {totalAbsen.sakit}
                  </td>
                </tr>
                <tr>
                  <td
                    scope="row"
                    className="px-4 py-1 w-[25%] text-center font-medium border border-gray-600"
                  >
                    {t('attendance.status.alpha')}
                  </td>
                  <td
                    scope="row"
                    className="px-4 py-1 w-[25%] text-center font-medium border border-gray-600"
                  >
                    {totalAbsen.alpha}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
);

PrintComponent.displayName = "PrintComponent";

export default PrintComponent;
