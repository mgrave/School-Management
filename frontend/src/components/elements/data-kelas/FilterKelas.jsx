import React, { forwardRef, useEffect, useRef } from "react";
import { useTranslation } from 'react-i18next';

const FilterKelas = forwardRef(
  ({ handleOptionChange, option, handleToggleFilter }, ref) => {
    const { t } = useTranslation();

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
              value={"terbaru"}
              id="terbaru"
              onChange={handleOptionChange}
              checked={option === "terbaru"}
              className="w-4 h-4"
            />
          </div>
          <div className="flex-between ">
            <label htmlFor="terlama" className="text-xs font-medium w-full">
              {t('ui.filters.orderOptions.oldest')}
            </label>

            <input
              type="radio"
              value={"terlama"}
              id="terlama"
              onChange={handleOptionChange}
              checked={option === "terlama"}
              className="w-4 h-4"
            />
          </div>
          <div className="flex-between ">
            <label htmlFor="a-z" className="text-xs font-medium w-full">
              {t('ui.filters.orderOptions.aToZ')}
            </label>

            <input
              type="radio"
              value={"a-z"}
              id="a-z"
              onChange={handleOptionChange}
              checked={option === "a-z"}
              className="w-4 h-4"
            />
          </div>
          <div className="flex-between ">
            <label htmlFor="z-a" className="text-xs font-medium w-full">
              {t('ui.filters.orderOptions.zToA')}
            </label>

            <input
              type="radio"
              value={"z-a"}
              id="z-a"
              onChange={handleOptionChange}
              checked={option === "z-a"}
              className="w-4 h-4"
            />
          </div>
          <div className="flex-between ">
            <label htmlFor="1-12" className="text-xs font-medium w-full">
              {t('forms.dataClasses.orderOptions.1-12')}
            </label>

            <input
              type="radio"
              value={"1-12"}
              id="1-12"
              onChange={handleOptionChange}
              checked={option === "1-12"}
              className="w-4 h-4"
            />
          </div>
          <div className="flex-between ">
            <label htmlFor="12-1" className="text-xs font-medium w-full">
              {t('forms.dataClasses.orderOptions.12-1')}
            </label>

            <input
              type="radio"
              value={"12-1"}
              id="12-1"
              onChange={handleOptionChange}
              checked={option === "12-1"}
              className="w-4 h-4"
            />
          </div>
          <div className="flex-between ">
            <label htmlFor="terbanyak" className="text-xs font-medium w-full">
              {t('forms.dataClasses.orderOptions.mostStudents')}
            </label>

            <input
              type="radio"
              value={"terbanyak"}
              id="terbanyak"
              onChange={handleOptionChange}
              checked={option === "terbanyak"}
              className="w-4 h-4"
            />
          </div>
          <div className="flex-between ">
            <label htmlFor="terdikit" className="text-xs font-medium w-full">
              {t('forms.dataClasses.orderOptions.leastStudents')}
            </label>

            <input
              type="radio"
              value={"terdikit"}
              id="terdikit"
              onChange={handleOptionChange}
              checked={option === "terdikit"}
              className="w-4 h-4"
            />
          </div>
        </div>
      </div>
    );
  }
);

FilterKelas.displayName = "filter";

export default FilterKelas;
