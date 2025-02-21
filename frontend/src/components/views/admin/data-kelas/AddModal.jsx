import CustomSelectOption from "@/components/elements/CustomSelectOption";
import HeaderModal from "@/components/elements/HeaderModal";
import Modal from "@/components/elements/Modal";
import { HOST } from "@/util/constant";
import responseError from "@/util/services";
import axios from "axios";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const AddModal = ({ onClose }) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: { waliKelas: "", kelas: "", nama: "", posisi: "" },
  });
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const handleChangeWaliKelas = (value) => {
    setValue("waliKelas", value);
  };

  const onSubmit = async (data) => {
    console.log(data);
    setLoading(true);
    try {
      const res = await axios.post(HOST + "/api/kelas/add-kelas", data, {
        withCredentials: true,
      });

      if (res.status === 200) {
        toast.success(res.data.message);
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
        className="w-full relative sm:max-w-[425px] max-h-[400px] rounded-lg shadow-md bg-white"
      >
        <div className="px-6 py-4 border-b">
          <HeaderModal
            titile={t('forms.dataClasses.buttons.addClass')}
            onClose={onClose}
            className={"font-semibold"}
          />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 ">
          <div className="flex-between gap-2 mb-2 px-6">
            <div className="">
              <label
                htmlFor="kelas"
                className="text-xs mb-2 block font-semibold text-gray-700"
              >
                {t('forms.dataClasses.labels.level')}
              </label>
              <input
                type="number"
                name="kelas"
                min={1}
                {...register("kelas", {
                  required: t('forms.dataClasses.validation.required.className'),
                  min: {
                    value: 1,
                    message: t('forms.dataClasses.validation.required.classNameMin')
                  },
                  max: {
                    value: 12,
                    message: t('forms.dataClasses.validation.required.classNameMax')
                  },
                })}
                className="w-full border text-xs px-2 py-1.5 rounded-md  outline-neutral border-gray-500"
              />
              <span className="text-xs h-4 text-neutral2 block">
                {errors.kelas && errors.kelas.message}
              </span>
            </div>
            <div className="">
              <label
                htmlFor="nama"
                className="text-xs mb-2 block font-semibold text-gray-700"
              >
                {t('forms.dataClasses.labels.class')}
              </label>
              <input
                id="nama"
                type="text"
                {...register("nama", {
                  required: t('forms.dataClasses.validation.required.name'),
                  maxLength: {
                    value: 20,
                    message: t('forms.dataClasses.validation.required.nameMax')
                  },
                })}
                className="w-full border text-xs px-2 py-1.5 rounded-md  outline-neutral border-gray-500"
              />
              <span className="text-xs h-4 text-neutral2 block">
                {errors.nama && errors.nama.message}
              </span>
            </div>
          </div>
          <div className="px-6  mb-4">
            <label
              htmlFor="waliKelas"
              className="text-xs mb-2 block font-semibold text-gray-700 w-fit"
            >
              {t('forms.dataClasses.labels.homeroomTeacher')}
            </label>

            <CustomSelectOption onChange={handleChangeWaliKelas} />
            <span className="text-xs font-medium h-4 mt-1 block">
              ({t('common.basic.optional')})
            </span>
          </div>

          <div className=" px-6">
            <label
              htmlFor="nama"
              className="text-xs mb-2 block font-semibold text-gray-700"
            >
              {t('forms.dataClasses.labels.classPosition')}
            </label>
            <input
              id="posisi"
              type="text"
              {...register("posisi")}
              className="w-full border text-xs px-2 py-1.5 rounded-md  outline-neutral border-gray-500"
            />
            <span className="text-xs font-medium h-4 mt-1 block">
              ({t('common.basic.optional')})
            </span>
          </div>

          <div className="text-end border-t mt-4 p-4 space-x-4">
            <button
              aria-label="simpan kelas"
              type="submit"
              disabled={loading}
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

export default AddModal;
