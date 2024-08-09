import { HOST } from "@/util/constant";
import responseError from "@/util/services";
import axios from "axios";
import { Check, Filter, Plus, Search, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import ClassIcon from "../../assets/svg/class.svg?react";
import TableUmum from "@/components/fragments/admin/data-umum/TableUmum";
import { toast } from "sonner";
import DeleteModal from "@/components/fragments/admin/data-umum/DeleteModal";

const DataUmumPage = () => {
  const [dataAjaran, setDataAjaran] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddajaran, setIsAddAjaran] = useState(false);
  const [isDeleteajaran, setIsDeleteajaran] = useState(false);
  const [ajaran, setAjaran] = useState("");
  const [trigger, setTrigger] = useState(1);

  useEffect(() => {
    const getAjaran = async () => {
      try {
        const res = await axios.get(HOST + "/api/ajaran/get-ajaran", {
          withCredentials: true,
        });

        if (res.status === 200) {
          setDataAjaran(res.data.ajaran);
        }
      } catch (error) {
        responseError(error);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 50);
      }
    };

    getAjaran();
  }, [isAddajaran, isDeleteajaran, trigger]);

  const handleAddAjaran = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        HOST + "/api/ajaran/add-ajaran",
        { ajaran },
        {
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        toast.success(res.data.message);
        handleToggleAdd();
      }
    } catch (error) {
      responseError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditAjaran = async (id) => {
    try {
      const res = await axios.put(
        HOST + "/api/ajaran/edit-ajaran/" + id,
        { id },
        { withCredentials: true }
      );

      if (res.status === 200) {
        toast.success(res.data.message);
        setTrigger(trigger + 1);
      }
    } catch (error) {
      responseError(error);
    }
  };

  const handleToggleAdd = () => {
    setAjaran("");
    setIsAddAjaran(!isAddajaran);
  };

  const handleToggleDelete = () => {
    setIsDeleteajaran(!isDeleteajaran);
  };

  return (
    <section className="px-6 py-4  ">
      <div>
        <div className="mb-8 w-full max-w-[475px] shadow-lg bg-white rounded-md border p-4">
          <div className="mb-2 gap-2 items-center grid md:grid-cols-2">
            <label htmlFor="" className="text-xs font-semibold">
              Kegiatan Belajar Mengajar
            </label>
            <div className="space-x-2">
              <input
                type="time"
                className="bg-none border border-gray-300 px-2 py-0.5 text-xs  rounded-md outline-neutral"
              />
              <span className="text-xs font-semibold">sd</span>
              <input
                type="time"
                className="bg-none border border-gray-300 px-2 py-0.5 text-xs rounded-md outline-neutral"
              />
            </div>
          </div>
          <div className="mb-2 gap-2 grid items-center md:grid-cols-2">
            <label htmlFor="" className="text-xs font-semibold text-gray-800">
              Semester
            </label>
            <select
              name=""
              id=""
              className="text-xs border max-w-[175px] border-gray-300 px-4 py-0.5 rounded-md outline-neutral"
            >
              <option value="ganjil">Semester Ganjil</option>
              <option value="genap">Semester Genap</option>
            </select>
          </div>
          <div className="grid md:ml-2 grid-cols-2 mt-4">
            <button className="self-start bg-neutral md:col-start-2 w-fit text-white text-xs px-4 py-2 rounded-md">
              Simpan
            </button>
          </div>
        </div>
        <div className="w-full flex-between  flex-wrap gap-6">
          <div className="flex-center ml-auto gap-2">
            {isAddajaran && (
              <div
                className={`${
                  isAddajaran
                    ? "translate-x-0 opacity-100"
                    : "-translate-x-40 opacity-0"
                } relative bg-white flex items-center border border-gray-400 rounded-md transition-all duration-300`}
              >
                <input
                  type="text"
                  name=""
                  id=""
                  value={ajaran}
                  onChange={(e) => setAjaran(e.target.value)}
                  maxLength={10}
                  className="py-2 px-2 text-xs rounded-md outline-neutral pr-14"
                />
                <div className="flex gap-2 absolute right-1">
                  <button
                    onClick={handleAddAjaran}
                    className="space-x-2 w-4 h-4 rounded-full flex-center bg-neutral1 text-white"
                  >
                    <Check width={12} height={12} />
                  </button>
                  <button
                    onClick={handleToggleAdd}
                    className=" w-4 h-4 rounded-full flex-center bg-neutral2 text-white"
                  >
                    <X width={12} height={12} />
                  </button>
                </div>
              </div>
            )}

            <button
              aria-label="tambah ajaran"
              onClick={handleToggleAdd}
              className="bg-neutral hover:bg-indigo-800 transition-all w-fit duration-300 text-white py-2.5 text-xs px-4 rounded-md flex-between gap-3"
            >
              <ClassIcon width={15} height={15} className=" " /> Tambah Ajaran
            </button>
          </div>
        </div>
        <div className="relative bg-white w-full  mt-6 border  overflow-hidden  rounded-md">
          {loading ? (
            <div className="block w-full relative bg-gray-200 animate-pulse shadow-md pb-[3.5rem]">
              <div className="w-full flex-center min-h-[231px] overflow-x-auto rounded-md">
                <div className="border-4 border-gray-300 rounded-full w-6 h-6 border-t-neutral animate-spin"></div>
              </div>
            </div>
          ) : (
            <TableUmum
              data={dataAjaran}
              handleToggleDelete={handleToggleDelete}
              loading={loading}
              handleEditAjaran={handleEditAjaran}
            />
          )}
        </div>
        {isDeleteajaran && <DeleteModal onClose={handleToggleDelete} />}
      </div>
    </section>
  );
};

export default DataUmumPage;
