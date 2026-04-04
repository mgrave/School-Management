import HeaderModal from "@/components/elements/HeaderModal";
import KelasDropdown from "@/components/elements/KelasDropdown";

import Modal from "@/components/elements/Modal";
import { HOST, MAX_FILE_SIZE } from "@/util/constant";
import responseError from "@/util/services";
import axios from "axios";
import { Upload, X } from "lucide-react";
import React, { createElement, useRef, useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const ModalUploadExcel = ({ onClose }) => {
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [message, setMassage] = useState("");
  const [dragging, setDragging] = useState(false);
  const { t } = useTranslation();

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    console.log(file);
    if (file.size >= MAX_FILE_SIZE) {
      setMassage("Ukuran file tidak bisa lebih dari 1 mb.");
      return;
    }

    if (
      !file.type.includes(
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      )
    ) {
      setMassage("Fortmat file tidak didukung.");
      return;
    }
    setFile(file);
  };

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
      setMassage("");
    }
  };

  const handleClose = () => {
    onClose();
    inputRef.current.value = null;
    setFile(null);
  };

  const handleDownloadTemplate = async () => {
    setLoading(true);
    try {
      const res = await axios.get(HOST + "/api/siswa/download-template", {
        withCredentials: true,
        responseType: "blob",
      });

      if (res.status === 200) {
        const url = window.URL.createObjectURL(new Blob([res.data]));

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "TemplateTambahSiswa.xlsx");
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    } catch (error) {
      responseError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadExcel = async () => {
    if (!file) {
      toast.warning("File tidak ditemukan.");
    }
    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);
    try {
      const res = await axios.post(HOST + "/api/siswa/upload-excel", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 200) {
        toast.success(res.data.message);
        onClose();
      }
    } catch (error) {
      responseError(error);
    } finally {
      setFile(null);
      inputRef.current.value = null;
      setLoading(false);
    }
  };

  return (
    <Modal onClose={handleClose}>
      <div
        className="w-full  sm:max-w-[450px] bg-white overflow-auto  rounded-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 sticky top-0 bg-white z-20 sm:static border-b">
          <HeaderModal
            titile={t('dataSiswa.addStudent')}
            onClose={handleClose}
            className={"font-bold"}
          />
        </div>
        <div className="my-4 px-4  ">
          <div>
            <h3 className="text-xs text-gray-700 text-center select-none mb-2 font-bold">
              {t('excel.upload_students')}
            </h3>
            <p className="text-xs">{t('excel.instructions.title')}:</p>
            <ol type="1" className="pl-5 text-[0.625rem] mt-2 mb-4">
              <li>
                <span className="font-medium">{t('excel.instructions.download')}</span> - 
                {t('excel.instructions.download_desc')}
              </li>
              <li>
                <span className="font-medium">{t('excel.instructions.fill_data')}</span> - 
                {t('excel.instructions.fill_data_desc')}
              </li>
              <li>
                <span className="font-medium">{t('excel.instructions.class_info')}</span> - 
                {t('excel.instructions.class_info_desc', {class: t('common.class')})}
              </li>
              <li>
                <span className="font-medium">{t('excel.instructions.upload_area')}</span> - 
                {t('excel.instructions.upload_area_desc')}
              </li>
              <li>
                <span className="font-medium">{t('excel.instructions.upload_file')}</span> - 
                {t('excel.instructions.upload_file_desc')}
              </li>
            </ol>
          </div>
          <div className="flex-center mb-4">
            <button
              onClick={handleDownloadTemplate}
              className=" py-2 px-4 text-xs   bg-neutral text-white rounded-md"
            >
              {t('excel.download_template')}
            </button>
          </div>

          <div
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`${
              dragging ? "bg-backup" : "bg-gray-100"
            } w-full py-4  flex-center flex-col     rounded-md border-gray-400 border`}
          >
            <div className=" mb-4">
              <Upload width={32} height={32} className="text-neutral" />
            </div>
            <h4 className="text-xs text-neutral select-none">
              {file ? (
                <span className="flex-center gap-2">
                  {file.name}{" "}
                  <button
                    className="w-4 h-4"
                    onClick={() => {
                      setFile(null);
                      inputRef.current.value = null;
                      setMassage("");
                    }}
                  >
                    <X width={14} height={14} />
                  </button>
                </span>
              ) : (
                <span>
                  {t('excel.drag_drop')}{' '}
                  <button onClick={handleClick} className="font-bold">
                    {t('common.select')}
                  </button>
                </span>
              )}
            </h4>
            <p
              className={`${
                message ? "text-neutral2  " : ""
              } text-[0.625rem] mt-1 text-neutral select-none `}
            >
              {message ? message : t('excel.file_requirements')}
            </p>
            <input
              onChange={handleFileChange}
              ref={inputRef}
              className="hidden"
              type="file"
              accept=".xlsx, .xls"
            />
          </div>
        </div>
        <div className="text-end border-t  p-4 space-x-4">
          <button
            aria-label="ya"
            onClick={handleUploadExcel}
            disabled={loading || !file}
            className="btn w-24 h-8.5 disabled:bg-gray-800"
          >
            {loading ? t('common.loading') : t('excel.upload')}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalUploadExcel;
