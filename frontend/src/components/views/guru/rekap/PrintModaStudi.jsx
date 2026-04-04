import React from "react";
import logo from "../../../../assets/Schoolarcy (2).webp";
import { useTranslation } from "react-i18next";

const PrintComponent = React.forwardRef(
  ({ data, totalPertemuan, kelas, semester }, ref) => {
    const { t } = useTranslation();

    return (
      <div ref={ref} className="p-4 page-landscape left-0 ">
        <div className="w-full flex-center">
          <img src={logo} alt="logo" width={200} height={200} />
        </div>
        <div className="w-full h-max p-8">
          <div className="w-full ">
            <table className=" w-full border border-collapse">
              <thead className="uppercase text-xs bg-gradient-to-r  from-[#12a7e3] to-neutral text-white">
                <tr>
                  <th
                    colSpan={totalPertemuan + 2}
                    scope="col"
                    className="py-4 border"
                  >
                    {t("grades.reportTitle", { 
                      grade: kelas.grade, 
                      name: kelas.nama, 
                      semester: semester 
                    })}
                  </th>
                </tr>
                <tr>
                  <th
                    scope="col"
                    rowSpan={2}
                    className="px-10 w-[30%] py-2 border text-center whitespace-nowrap"
                  >
                    {t("tableNilai.studentName")}
                  </th>

                  <th
                    scope="col"
                    colSpan={totalPertemuan + 1}
                    className="px-4 pr-4 py-2 text-center border whitespace-nowrap"
                  >
                    Pertemuan
                  </th>
                </tr>
                <tr>
                  {Array(totalPertemuan)
                    .fill()
                    .map((_, i) => (
                      <th
                        key={i + 1}
                        scope="col"
                        className="px-2 text-center border"
                      >
                        {i + 1}
                      </th>
                    ))}
                  <th scope="col" className="px-2 text-center border">
                    {t("common.exam_abbr")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {data &&
                  data.map((nilai) => (
                    <tr key={nilai.id}>
                      <td
                        scope="row"
                        className="px-4 py-1 border text-xs capitalize text-gray-800 font-medium"
                      >
                        {nilai.nama}
                      </td>
                      {nilai?.dataNilai?.map((data, i) => (
                        <td
                          key={i + 1}
                          scope="row"
                          className="px-2 py-1 border text-center text-xs capitalize text-gray-800 font-medium"
                        >
                          {data}
                        </td>
                      ))}
                    </tr>
                  ))}
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
