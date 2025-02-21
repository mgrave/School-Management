import DashboardIcon from "../../../assets/svg/dashboard.svg?react";
import SiswaIcon from "../../../assets/svg/siswa.svg?react";
import GuruIcon from "../../../assets/svg/guru.svg?react";
import KelasIcon from "../../../assets/svg/class.svg?react";
import MapelIcon from "../../../assets/svg/pelajaran.svg?react";
import JadwalIcon from "../../../assets/svg/jadwal.svg?react";
// import DataIcon from "../../../assets/svg/data.svg?react";
import AcaraIcon from "../../../assets/svg/acara.svg?react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  ChevronUp,
  FileStack,
  MonitorCog,
  NotebookPen,
  NotebookTabs,
  NotebookText,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from 'react-i18next';
// import KelasSVG from "@/components/base/svg/KelasSVG

const ListSidebarAdmin = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeDropDown, setActiveDropDown] = useState(null);

  const handleDropdown = (index) => {
    if (activeDropDown === index) {
      setActiveDropDown(null);
    } else {
      setActiveDropDown(index);
    }
  };

  const Navlist = [
    {
      id: 1,
      nama: t('forms.dataClasses.labels.dashboard'),
      path: "/admin/dashboard",
      icon: (
        <DashboardIcon
          height={17}
          width={17}
          className={
            "text-white group-hover:text-neutral stroke-[2] duration-300 transition-all"
          }
        />
      ),
    },
    {
      id: 2,
      nama: t('forms.dataClasses.labels.masterData'),
      path: "/admin/master-data",
      icon: (
        <MonitorCog
          height={17}
          width={17}
          className={
            "text-white group-hover:text-neutral stroke-[2] duration-300 transition-all"
          }
        />
      ),
    },
    {
      id: 3,
      nama: t('forms.dataClasses.labels.student'),
      path: "/admin/data-siswa",
      icon: (
        <SiswaIcon
          height={19}
          width={19}
          className={
            "text-white group-hover:stroke-neutral group-hover:fill-neutral stroke-[0.1] duration-300 transition-all"
          }
        />
      ),
    },
    {
      id: 4,
      nama: t('forms.dataClasses.labels.teacher'),
      path: "/admin/data-guru",
      icon: (
        <GuruIcon
          height={20}
          width={20}
          className="text-white group-hover:text-neutral duration-300 transition-all"
        />
      ),
    },
    {
      id: 5,
      nama: t('forms.dataClasses.labels.class'),
      path: "/admin/data-kelas",
      icon: (
        <KelasIcon
          height={20}
          width={20}
          className={
            "text-white group-hover:text-neutral stroke-[0.1] duration-300 transition-all"
          }
        />
      ),
    },
    {
      id: 6,
      nama: t('forms.dataClasses.labels.subjects'),
      path: "/admin/data-pelajaran",
      icon: (
        <MapelIcon
          height={20}
          width={20}
          className={
            "text-white group-hover:text-neutral duration-300 transition-all"
          }
        />
      ),
    },
    {
      id: 7,
      nama: t('forms.dataClasses.labels.schedule'),
      path: "/admin/data-jadwal",
      icon: (
        <AcaraIcon
          height={20}
          width={20}
          className={
            "text-white group-hover:text-neutral duration-300 transition-all"
          }
        />
      ),
    },
    {
      id: 8,
      nama: t('forms.dataClasses.labels.reports'),
      icon: (
        <NotebookTabs
          height={20}
          width={20}
          className={
            "text-white group-hover:text-neutral duration-300 transition-all"
          }
        />
      ),

      dropDown: [
        {
          id: 1,
          nama: t('forms.dataClasses.labels.attendance'),
          path: "/admin/rekap-absensi-kelas",
          icon: (
            <NotebookPen
              height={20}
              width={20}
              className={
                "text-white group-hover:text-neutral duration-300 transition-all"
              }
            />
          ),
        },
        {
          id: 2,
          nama: t('forms.dataClasses.labels.grades'),
          path: "/admin/rekap-nilai-kelas",
          icon: (
            <NotebookText
              height={20}
              width={20}
              className={
                "text-white group-hover:text-neutral duration-300 transition-all"
              }
            />
          ),
        },
      ],
    },
  ];

  return (
    <ul className="w-full py-1 h-[80vh] overflow-auto">
      {Navlist.map((list) => (
        <li
          onClick={() => handleDropdown(list.id)}
          key={list.id}
          className="relative outline-none ml-6 md:ml-4 lg:ml-6 "
        >
          <NavLink
            to={list.path}
            className="relative flex justify-start  outline-white z-10 pl-4 items-center py-3  gap-3 group hover:bg-background cursor-pointer rounded-tl-full rounded-bl-full "
          >
            {list.icon}
            <span className="text-white   mt-0.5 text-sm font-light group-hover:text-neutral group-hover:font-medium ">
              {list.nama}
            </span>
            {list.dropDown && (
              <div className="absolute right-10 top-1/2 -translate-y-1/2 ">
                {activeDropDown === list.id ? (
                  <ChevronUp
                    className=" group-hover:text-neutral text-white "
                    strokeWidth={2}
                    width={20}
                    height={20}
                  />
                ) : (
                  <ChevronDown
                    className=" group-hover:text-neutral text-white "
                    strokeWidth={2}
                    width={20}
                    height={20}
                  />
                )}
              </div>
            )}
          </NavLink>

          {list.dropDown && (
            <div
              className={`${
                activeDropDown === list.id
                  ? "max-h-[90px] my-1 "
                  : "max-h-0 opacity-0"
              }   transition-all duration-300 ease-in-out overflow-hidden  rounded-xl w-fit `}
              onClick={(e) => e.stopPropagation()}
            >
              {list.dropDown.map((drop) => (
                <button
                  onClick={() => {
                    navigate(drop.path);
                    setActiveDropDown(null);
                  }}
                  key={drop.id}
                  className="flex items-center gap-2 px-2 group hover:bg-white h-8 my-2 mx-3 w-36 rounded-md"
                >
                  {drop.icon}
                  <span className="text-white    text-sm font-light group-hover:text-neutral group-hover:font-medium ">
                    {drop.nama}
                  </span>
                </button>
              ))}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};

export default ListSidebarAdmin;
