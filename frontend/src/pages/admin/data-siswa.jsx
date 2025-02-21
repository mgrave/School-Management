import CustomDropdown from "@/components/elements/DropDown";
import Student from "../../assets/svg/Teacher.svg";
import DropdownFilter from "@/components/elements/DropDownFilter";
import HeaderBox from "@/components/elements/data-siswa/HeaderBox";
import TableSiswa from "@/components/views/admin/data-siswa/TableSiswa";
import {
  selectedDataDelete,
  selectedDataDeleteMany,
} from "@/store/slices/admin-slice";
import { HOST } from "@/util/constant";
import { formatDate } from "@/util/formatDate";
import responseError from "@/util/services";
import ExcelJs from "exceljs";
import axios from "axios";
import { FileDown, Plus, Search, Trash2, Upload } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { saveAs } from "file-saver";
import DeleteModal from "@/components/fragments/ModalDelete";
import DeleteManyModal from "@/components/fragments/ModalDeleteMany";
import ModalUploadExcel from "@/components/views/admin/data-siswa/ModalUploadExcel";
import InputSearch from "@/components/elements/InputSearch";
import { useTranslation } from 'react-i18next';

const selectRow = [7, 14, 21, 28];

const DataSiswaPage = () => {
  const { t } = useTranslation();
  const dataChecked = useSelector(selectedDataDeleteMany);
  const dataDelete = useSelector(selectedDataDelete);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [dataSiswa, setDataSiswa] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 7,
    totalPages: 0,
    totalSiswa: 0,
  });
  const [dataDetail, setDataDetail] = useState([]);

  const [isDeleteSiswa, setIsDeleteSiswa] = useState(false);
  const [isDeleteManySiswa, setIsDeletManySiswa] = useState(false);
  const [isUpload, setIsUpload] = useState(false);
  const [allCheck, setAllCheck] = useState(false);
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    kelas: "",
    kelasNama: "",
    jenisKelamin: "",
    tahunMasuk: "",
  });

  const page = parseInt(searchParams.get("page")) || pagination.page;
  const limit = parseInt(searchParams.get("limit")) || pagination.limit;
  const search = searchParams.get("search") || "";

  useEffect(() => {
    const getData = async () => {
      try {
        const [siswa, detail] = await Promise.all([
          axios.get(`${HOST}/api/siswa/get-all-siswa`, {
            params: {
              page: page,
              limit: limit,
              search,
              tahunMasuk: filters.tahunMasuk,
              jenisKelamin: filters.jenisKelamin,
              kelas: filters.jenisKelamin,
              kelasNama: filters.kelasNama,
            },
            withCredentials: true,
          }),
          axios.get(`${HOST}/api/siswa/get-detail-siswa`, {
            withCredentials: true,
          }),
        ]);

        if (siswa.status == 200) {
          setDataSiswa(siswa.data.data);
          setPagination(siswa.data.pagination);
        }

        if (detail.status === 200) {
          setDataDetail(detail.data.data);
        }
      } catch (error) {
        responseError(error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [
    page,
    limit,
    search,
    isDeleteSiswa,
    isDeleteManySiswa,
    filters,
    isUpload,
  ]);

  const handleToggleUpload = () => {
    setIsUpload(!isUpload);
  };

  const handleSelectBaris = (option) => {
    if (option === 7) {
      searchParams.delete("limit");
      setPagination((prev) => ({ ...prev, limit: 7 }));
      navigate("/admin/data-siswa?" + searchParams.toString(), {
        replace: true,
      });
      if (searchParams.size === 1 && searchParams.get("page") === "1") {
        searchParams.delete("page");
        navigate("/admin/data-siswa?" + searchParams.toString(), {
          replace: true,
        });
      }
    } else {
      searchParams.set("page", "1");
      searchParams.set("limit", option.toString());

      navigate(`/admin/data-siswa?${searchParams.toString()}`);
    }
  };

  const handleFilterChange = (filterName, filterValue) => {
    if (filterName === "kelas" && filterValue === "") {
      setFilters((prev) => ({ ...prev, kelasNama: "" }));
    }
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: filterValue,
    }));
  };

  return (
    <section className="px-6 py-4 mb-4 ">
      <HeaderBox dataDetail={dataDetail} loading={loading} />
      <div className="w-full flex-between flex-wrap gap-6">
        <InputSearch loading={loading} />

        <div className="ml-auto flex-center gap-2 ">
          <button
            onClick={handleToggleUpload}
            className="btn bg-neutral rounded-md flex-center "
            title={t('forms.dataStudent.buttons.uploadExcel')}
          >
            <Upload width={15} height={15} className="text-white" />
          </button>
          <Link
            to={"/admin/tambah-siswa"}
            className="flex-between gap-3 min-w-fit bg-neutral hover:bg-indigo-800 transition-all duration-300 text-white py-2.5 text-xs px-4 rounded-md "
          >
            <img src={Student} alt="student" width={15} height={15} />
            {t('forms.dataStudent.buttons.addStudent')}
          </Link>
        </div>
      </div>

      <div className="relative bg-white w-full  mt-6 border  overflow-hidden  rounded-lg">
        <div className="flex-between px-4 h-14 ">
          <div className="flex items-center gap-4  ">
            <button
              title={t('forms.dataStudent.buttons.deleteSelected')}
              disabled={loading}
              onClick={() => setIsDeletManySiswa(!isDeleteManySiswa)}
              className={`${
                dataChecked.length > 0 ? "opacity-100" : "opacity-0"
              } border block border-gray-300 bg-white text-gray-500 group rounded-md disabled:cursor-not-allowed  hover:border-gray-400    py-1.5 px-2 transition-all duration-300 font-medium hover:text-white  text-xs   flex-between gap-3`}
            >
              <Trash2 width={15} height={15} className=" text-neutral2 " />
            </button>

            <CustomDropdown
              options={selectRow}
              onSelect={handleSelectBaris}
              selected={pagination.limit}
            />
            <DropdownFilter
              handleFilterChange={handleFilterChange}
              setFilters={setFilters}
            />
          </div>
          <div>
            <button
              title={t('forms.dataStudent.buttons.exportExcel')}
              disabled={loading}
              className="hover:bg-neutral transition-all disabled:cursor-not-allowed duration-300 group border p-1.5 rounded-md"
              onClick={() => exportToExcel(dataSiswa)}
            >
              <FileDown
                width={20}
                height={20}
                strokeWidth={1}
                className="group-hover:text-white"
              />
            </button>
          </div>
        </div>
        {loading ? (
          <div className="block w-full shadow-md pb-[3.5rem]">
            <div className="w-full min-h-[453px] flex-center bg-backup animate-pulse overflow-auto ">
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white to-transparent flex-center opacity-50 animate-shimmer"></div>
            </div>
          </div>
        ) : (
          <TableSiswa
            data={dataSiswa}
            page={pagination.page}
            limit={pagination.limit}
            totalSiswa={pagination.total}
            totalPage={pagination.totalPages}
            handleToggleDeleteOne={() => setIsDeleteSiswa(!isDeleteSiswa)}
            setAllCheck={setAllCheck}
            allCheck={allCheck}
            loading={loading}
            setPagination={setPagination}
          />
        )}
      </div>
      {isDeleteSiswa && (
        <DeleteModal
          onClose={() => setIsDeleteSiswa(!isDeleteSiswa)}
          url={"/api/siswa/delete-one-siswa/" + dataDelete._id}
          title={t('forms.dataStudent.messages.confirmDeleteSingle')}
        />
      )}
      {isDeleteManySiswa && (
        <DeleteManyModal
          onClose={() => setIsDeletManySiswa(!isDeleteManySiswa)}
          setAllCheck={setAllCheck}
          url={"/api/siswa/delete-many-siswa"}
          title={t('forms.dataStudent.messages.confirmDeleteMultiple')}
        />
      )}
      {isUpload && <ModalUploadExcel onClose={handleToggleUpload} />}
    </section>
  );
};

const exportToExcel = async (data) => {
  const { t } = useTranslation();
  const workbook = new ExcelJs.Workbook();
  const worksheet = workbook.addWorksheet(t('forms.dataStudent.title'));

  worksheet.mergeCells("A1:J1");
  worksheet.getCell("A1").value = t('forms.dataStudent.title');
  worksheet.getCell("A1").font = { size: 16, bold: true };
  worksheet.getCell("A1").border = {
    top: { style: "thin", color: "FFFFFFFF" },
    left: { style: "thin", color: "FFFFFFFF" },
    bottom: { style: "thin", color: "FFFFFFFF" },
    right: { style: "thin", color: "FFFFFFFF" },
  };
  worksheet.getCell("A1").alignment = {
    vertical: "middle",
    horizontal: "center",
  };

  worksheet.getRow(2).values = [
    t('forms.dataStudent.labels.nis'),
    t('forms.dataStudent.labels.name'),
    t('forms.dataStudent.labels.gender'),
    t('forms.dataStudent.labels.birthPlace'),
    t('forms.dataStudent.labels.birthDate'),
    t('forms.dataStudent.labels.religion'),
    t('forms.dataStudent.labels.entryYear'),
    t('forms.dataStudent.labels.address'),
    t('forms.dataStudent.labels.phone'),
    t('forms.dataStudent.labels.class')
  ];
  worksheet.getRow(2).eachCell((cell, colNumber) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "362f7e" },
    };
    cell.font = { color: { argb: "FFFFFFFF" }, bold: true };
    cell.alignment = { vertical: "middle", horizontal: "center" };
    cell.border = {
      top: { style: "thin", color: "FFFFFFFF" },
      left: { style: "thin", color: "FFFFFFFF" },
      bottom: { style: "thin", color: "FFFFFFFF" },
      right: { style: "thin", color: "FFFFFFFF" },
    };
    worksheet.getColumn(colNumber).width =
      colNumber === 1
        ? 20
        : colNumber === 2
        ? 30
        : colNumber === 6
        ? 25
        : colNumber === 8
        ? 30
        : colNumber === 10
        ? 25
        : colNumber === 3
        ? 15
        : 15;
  });

  data.forEach((siswa) => {
    const kelas = `${siswa?.kelas?.kelas || ""} ${siswa?.kelas?.nama || ""}`;

    const rowValues = [
      siswa.nis,
      siswa.nama,
      siswa.jenisKelamin,
      siswa.tempatLahir,
      formatDate(siswa.tanggalLahir),
      siswa.agama,
      siswa.tahunMasuk,
      siswa.alamat,
      siswa.phone,
      kelas ? kelas : "kosong",
    ];

    const row = worksheet.addRow(rowValues);

    row.eachCell((cell) => {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: "application/octet-stream" });
  saveAs(blob, `Data Siswa.xlsx`);
};

export default DataSiswaPage;
