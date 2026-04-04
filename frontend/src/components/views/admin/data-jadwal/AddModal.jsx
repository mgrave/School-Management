import HeaderModal from "@/components/elements/HeaderModal";
import Modal from "@/components/elements/Modal";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import responseError from "@/util/services";
import axios, { all } from "axios";
import { HOST } from "@/util/constant";
import { toast } from "sonner";
import DropdownGuru from "@/components/elements/DropdownGuru";
import DayDropdown from "@/components/elements/DayDropdown";
import KelasDropdown from "@/components/elements/KelasDropdown";
import NamaKelasDropdown from "@/components/elements/NamaKelasDropdown";
import DropdownBidangStudi from "@/components/elements/DropdownBidangStudi";
import { useTranslation } from "react-i18next";

const AddModal = ({ onClose }) => {
  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      bidangStudi: "",
      guru: "",
      kelas: "",
      namaKelas: "",
      hari: "",
      start: undefined,
      end: undefined,
      jumlahPertemuan: "",
    },
  });
  const [loading, setLoading] = useState(false);
  const bidangStudi = watch("bidangStudi");
  const kelas = watch("kelas");
  const { t } = useTranslation();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await axios.post(
        HOST + "/api/jadwal/add-jadwal",
        {
          guru: data.guru,
          kelas: data.namaKelas,
          bidangStudi: data.bidangStudi.id,
          mulai: data.start,
          selesai: data.end,
          hari: data.hari,
          jumlahPertemuan: data.jumlahPertemuan,
        },
        { withCredentials: true }
      );

      if (res.status === 201) {
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
        className="w-full sm:max-w-[470px] max-h-screen sm:max-h-none overflow-auto rounded-lg shadow-md bg-white"
      >
        <div className="p-4 sticky top-0 bg-white z-20 sm:static border-b">
          <HeaderModal
            titile={t("schedule.add_schedule")}
            onClose={onClose}
            className={"font-semibold"}
          />
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 ">
          <div className="px-4 mb-2 ">
            <label
              htmlFor="bidangStudi"
              className="text-xs mb-2 block w-fit font-semibold text-gray-700"
            >
              {t("schedule.study_field")}
            </label>
            <Controller
              name="bidangStudi"
              control={control}
              rules={{ required: t("validation.required.field", { field: t("schedule.study_field") }) }}
              render={({ field: { onChange, value } }) => (
                <DropdownBidangStudi value={value} onChange={onChange} />
              )}
            />
            <span className="text-xs h-4 text-neutral2 block">
              {errors.bidangStudi && errors.bidangStudi.message}
            </span>
          </div>
          <div className="px-4 mb-2">
            <label
              htmlFor="guru"
              className="text-xs w-fit mb-2 block font-semibold text-gray-700"
            >
              {t("common.roles.guru")}
            </label>
            <Controller
              name="guru"
              control={control}
              rules={{ required: t("validation.required.field", { field: t("common.roles.guru") }) }}
              render={({ field: { onChange, value } }) => (
                <DropdownGuru
                  bidangStudi={bidangStudi.id}
                  onChange={onChange}
                  value={value}
                />
              )}
            />

            <span className="text-xs h-4 text-neutral2 block">
              {errors.guru && errors.guru.message}
            </span>
          </div>
          <div
            className={`flex justify-between flex-wrap sm:flex-nowrap gap-2`}
          >
            <div className="px-4 mb-2">
              <label
                htmlFor="kelas"
                className="text-xs w-fit mb-2 block font-semibold text-gray-700"
              >
                {t("common.class")}
              </label>
              <Controller
                name="kelas"
                control={control}
                rules={{ required: t("validation.required.field", { field: t("common.class") }) }}
                render={({ field: { onChange, value } }) => (
                  <KelasDropdown value={value} onChange={onChange} />
                )}
              />
              <span className="text-xs h-4 text-neutral2 block">
                {errors.kelas && errors.kelas.message}
              </span>
            </div>

            <div className="px-4 mb-2">
              <label
                htmlFor="namaKelas"
                className="text-xs w-fit mb-2 block font-semibold text-gray-700"
              >
                {t("class.columnClassName")}
              </label>
              <Controller
                control={control}
                name="namaKelas"
                rules={{ required: t("validation.required.field", { field: t("class.columnClassName") }) }}
                render={({ field: { onChange, value } }) => (
                  <NamaKelasDropdown
                    onChange={onChange}
                    value={value}
                    kelas={kelas}
                  />
                )}
              />
              <span className="text-xs h-4 text-neutral2 block">
                {errors.namaKelas && errors.namaKelas.message}
              </span>
            </div>

            <div className="px-4 mb-2">
              <label
                htmlFor="hari"
                className="text-xs w-fit mb-2 block font-semibold text-gray-700"
              >
                {t("common.days.day")}
              </label>
              <Controller
                control={control}
                name="hari"
                rules={{ required: t("validation.required.field", { field: t("common.days.day") }) }}
                render={({ field: { onChange, value } }) => (
                  <DayDropdown onChange={onChange} value={value} />
                )}
              />
              <span className="text-xs h-4 text-neutral2 block">
                {errors.hari && errors.hari.message}
              </span>
            </div>
          </div>

          <div className="px-4 mb-2">
            <span className="text-xs w-fit mb-2 block font-semibold text-gray-700">
              {t("schedule.start_time")}
            </span>
            <div className="flex-between gap-4 w-full">
              <div className=" gap-2 text-xs w-full">
                <label htmlFor="mulai" className="block mb-3">
                  {t("schedule.start_time")}
                </label>
                <div className="w-full">
                  <input
                    type="time"
                    id="mulai"
                    {...register("start", {
                      required: t("validation.required.time", { time: t("schedule.start_time") })
                    })}
                    className="block w-full text-xs bg-white border border-gray-400 hover:border-gray-500 px-2 py-1 rounded-md shadow leading-tight focus:outline-neutral focus:shadow-outline"
                  />
                  <span className="text-xs h-4 text-neutral2 block">
                    {errors.start && errors.start.message}
                  </span>
                </div>
              </div>
              <div className=" gap-2 text-xs w-full">
                <label htmlFor="selesai" className="block mb-3">
                  {t("schedule.end_time")}
                </label>
                <div className="w-full">
                  <input
                    type="time"
                    id="selesai"
                    {...register("end", {
                      required: t("validation.required.time", { time: t("schedule.end_time") })
                    })}
                    className="block w-full text-xs bg-white border border-gray-400 hover:border-gray-500 px-2 py-1 rounded-md shadow leading-tight focus:outline-neutral focus:shadow-outline "
                  />
                  <span className="text-xs h-4 text-neutral2 block">
                    {errors.end && errors.end.message}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 pb-2">
            <label
              htmlFor="jumlah pertemuan"
              className="text-xs w-fit mb-2 block font-semibold text-gray-700"
            >
              {t("schedule.meeting_count")}{" "}
              <span className="text-[0.625rem] text-neutral2">
                {t("schedule.meeting_limit")}
              </span>
            </label>
            <input
              id="jumlah pertemuan"
              {...register("jumlahPertemuan", {
                required: t("validation.required.meetings"),
                max: {
                  value: 50,
                  message: t("validation.meeting_range"),
                },
                min: {
                  value: 15,
                  message: "Minimal jumlah pertemuan di kelas adalah 15",
                },
              })}
              type="number"
              placeholder="Masukkan jumlah pertemuan"
              className=" w-full text-xs bg-white border border-gray-400 hover:border-gray-500 px-2 py-2 rounded-md shadow leading-tight focus:outline-neutral focus:shadow-outline "
            />
            <span className="text-xs h-4 text-neutral2 block">
              {errors.jumlahPertemuan && errors.jumlahPertemuan.message}
            </span>
          </div>

          <div className="text-end border-t mt-4 p-4 space-x-4">
            <button
              aria-label="simpan kelas"
              type="submit"
              disabled={loading}
              className="btn w-24 h-8.5"
            >
              {loading ? t("common.loading") : t("common.save")}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddModal;
