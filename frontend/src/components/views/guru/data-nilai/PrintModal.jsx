import React from "react";
import logo from "../../../../assets/Schoolarcy (2).webp";
import { useTranslation } from "react-i18next";

const PrintComponent = React.forwardRef(({ data, dataNilai }, ref) => {
  const { t } = useTranslation();

  return (
    <div ref={ref} className="p-4 page-landscape">
      <div className="w-full flex-center">
        <img src={logo} alt="logo" width={200} height={200} />
      </div>
      <div className="w-full h-max p-8">
        <table className="w-full text-left text-gray-500 border">
          <thead className="text-xs text-left text-white uppercase bg-gradient-to-r from-[#12a7e3] to-neutral">
            <tr>
              <th
                scope="col"
                colSpan={6}
                className="px-3 py-2 text-center border-b border-white"
              >
                {t('excel.student_data', { class: data.kelas, name: data.nama })}
              </th>
            </tr>
            <tr className="border">
              <th scope="col" className="px-10 py-4 whitespace-nowrap">
                {t('subjects.pageTitle')}
              </th>
              <th
                scope="col"
                className="px-10 pr-4 py-4 whitespace-nowrap border"
              >
                {t('excel.studentName')}
              </th>
              <th
                scope="col"
                className="px-5 py-4 text-center whitespace-nowrap border"
              >
                {t('grades.category')}
              </th>
              <th scope="col" className="px-3 py-4 text-center border">
                {t('grades.score')}
              </th>
              <th
                scope="col"
                className="px-5 py-4 text-center whitespace-nowrap border"
              >
                {t('common.academicYear')}
              </th>
              <th scope="col" className="py-4 text-center">
                {t('common.semester')}
              </th>
            </tr>
          </thead>
          <tbody>
            {dataNilai && dataNilai.length === 0 && (
              <tr>
                <td
                  colSpan="9"
                  className="px-2 py-2 border-gray-300 text-xs font-medium text-gray-900 h-[350px] whitespace-nowrap"
                >
                  <div className="flex justify-center w-full">
                    Tidak ada data
                  </div>
                </td>
              </tr>
            )}
            {dataNilai &&
              dataNilai.length !== 0 &&
              dataNilai.map((nilai) => (
                <tr key={nilai._id} className="hover:bg-gray-100">
                  <td
                    scope="row"
                    className="px-10 py-1 text-xs font-normal text-gray-900 whitespace-nowrap border"
                  >
                    {nilai.mataPelajaran.kode} {nilai.mataPelajaran.nama}
                  </td>
                  <td
                    scope="row"
                    className="px-10 pr-4 py-1 line-clamp-1 text-xs font-normal text-gray-900 whitespace-nowrap border"
                  >
                    {nilai.siswa.nama}
                  </td>
                  <td
                    scope="row"
                    className="py-1 px-5 text-xs font-normal text-center text-gray-900 whitespace-nowrap border"
                  >
                    {nilai.kategori}
                  </td>
                  <td
                    scope="row"
                    className="py-1 px-3 text-xs text-center font-normal text-gray-900 whitespace-nowrap border"
                  >
                    {nilai.nilai}
                  </td>
                  <td
                    scope="row"
                    className="px-5 py-1 text-center overflow-hidden line-clamp-1 text-xs font-normal text-gray-900 whitespace-nowrap border"
                  >
                    {nilai.tahunAjaran}
                  </td>
                  <td
                    scope="row"
                    className="py-1 text-center text-xs font-normal text-gray-900 whitespace-nowrap border"
                  >
                    {nilai.semester}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

PrintComponent.displayName = "PrintComponent";

export default PrintComponent;
