import HeaderModal from "@/components/elements/HeaderModal";
import Modal from "@/components/elements/Modal";
import { selectedDataEdit, setDataEdit } from "@/store/slices/admin-slice";
import { HOST } from "@/util/constant";
import responseError from "@/util/services";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { useTranslation } from 'react-i18next';

const EditModal = ({ onClose }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const editData = useSelector(selectedDataEdit);
  const { t } = useTranslation();

  useEffect(() => {
    if (editData) {
      setValue("kode", editData.kode);
      setValue("nama", editData.nama);
    }
  }, [editData]);

  console.log(editData);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await axios.put(
        HOST + "/api/mapel/edit-mapel/" + editData._id,
        data,
        {
          withCredentials: true,
        }
      );
      if (res.status === 200) {
        toast.success(res.data.message);
        dispatch(setDataEdit(undefined));
        onClose();
      }
    } catch (error) {
      responseError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-[400px] max-h-[400px] rounded-lg shadow-md bg-white"
      >
        <div className="py-4 px-6 border-b">
          <HeaderModal
            titile={t('forms.dataLessons.title')}
            onClose={onClose}
            className={"font-semibold"}
          />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 ">
          <div className="mb-4 px-6">
            <label
              htmlFor="kode"
              className="text-xs mb-2 block font-semibold text-gray-700"
            >
              {t('forms.dataSubjects.labels.subjectCode')}
            </label>
            <input
              type="text"
              id="kode"
              name="kode"
              {...register("kode", {
                required: t('forms.dataSubjects.validation.required.subjectCode'),
              })}
              className="w-full border text-xs px-2 py-1.5 rounded-md  outline-neutral border-gray-500"
            />
            <span className="text-xs h-4 text-neutral2 block">
              {errors.kode && errors.kode.message}
            </span>
          </div>

          <div className="mb-4 px-6">
            <label
              htmlFor="nama"
              className="text-xs mb-2 block font-semibold text-gray-700"
            >
              {t('forms.dataSubjects.labels.subjectName')}
            </label>
            <input
              id="nama"
              type="text"
              {...register("nama", {
                required: t('forms.dataSubjects.validation.required.subjectName'),
              })}
              className="w-full border text-xs px-2 py-1.5 rounded-md  outline-neutral border-gray-500"
            />
            <span className="text-xs h-4 text-neutral2 block">
              {errors.nama && errors.nama.message}
            </span>
          </div>

          <div className="text-end border-t mt-4 p-4 space-x-4">
            <button
              aria-label="simpan kelas"
              type="submit"
              className="btn w-24 h-8.5"
            >
              {loading ? t('common.status.loading') : t('ui.buttons.save')}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default EditModal;
