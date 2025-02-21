import React, { forwardRef, useEffect, useRef } from "react";
import { useTranslation } from 'react-i18next';

const FilterSiswa = forwardRef(
  ({ handleOptionChange, filter, handleToggleFilter, isFilter }, ref) => {
    const { t } = useTranslation();

    useEffect(() => {
      const handleClickOutside = (e) => {
        if (ref.current && !ref.current.contains(e.target)) {
          handleToggleFilter();
        }
      };
      document.addEventListener("mousedown", handleClickOutside);

      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, [isFilter]);

    return (
      <div
        ref={ref}
        className="w-[200px] border left-0 top-8 rounded-lg absolute  bg-white shadow-md z-10 flex flex-col flex-between py-3 items-stretch"
      >
        <h4 className="text-xs border-b mb-2 px-3 pb-3 font-medium text-gray-700">
          {t('ui.filters.sortBy')}:
        </h4>
        <div className="px-3 space-y-2">
          <div className="flex-between ">
            <label htmlFor="terbaru" className="text-xs font-medium w-full">
              {t('ui.filters.orderOptions.newest')}
            </label>

            <input
              type="radio"
              value={"newest"}
              id="terbaru"
              onChange={handleOptionChange}
              checked={filter === "newest"}
              className="w-4 h-4"
            />
          </div>
          <div className="flex-between ">
            <label htmlFor="terlama" className="text-xs font-medium w-full">
              {t('ui.filters.orderOptions.oldest')}
            </label>

            <input
              type="radio"
              value={"oldest"}
              id="terlama"
              onChange={handleOptionChange}
              checked={filter === "oldest"}
              className="w-4 h-4"
            />
          </div>
          <div className="flex-between ">
            <label htmlFor="a-z" className="text-xs font-medium w-full">
              {t('ui.filters.orderOptions.aToZ')}
            </label>

            <input
              type="radio"
              value={"aToZ"}
              id="a-z"
              onChange={handleOptionChange}
              checked={filter === "aToZ"}
              className="w-4 h-4"
            />
          </div>
          <div className="flex-between ">
            <label htmlFor="z-a" className="text-xs font-medium w-full">
              {t('ui.filters.orderOptions.zToA')}
            </label>

            <input
              type="radio"
              value={"zToA"}
              id="z-a"
              onChange={handleOptionChange}
              checked={filter === "zToA"}
              className="w-4 h-4"
            />
          </div>
        </div>
      </div>
    );
  }
);

FilterSiswa.displayName = "filter";

export default FilterSiswa;
