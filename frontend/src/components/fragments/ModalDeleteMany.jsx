import HeaderModal from "@/components/elements/HeaderModal";
import Modal from "@/components/elements/Modal";
import {
  selectedDataDeleteMany,
  setDataDeleteMany,
} from "@/store/slices/admin-slice";
import { HOST } from "@/util/constant";
import responseError from "@/util/services";
import axios from "axios";
import { TriangleAlert } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { useTranslation } from 'react-i18next';

const DeleteManyModal = ({ onClose, setAllCheck, url, title }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const dataChecked = useSelector(selectedDataDeleteMany);

  const handleDelete = async () => {
    setLoading(true);

    if (url) {
      try {
        const res = await axios.delete(HOST + url, {
          data: { dataChecked },
          withCredentials: true,
        });

        toast.success(res.data.message);
        setAllCheck(false);
        dispatch(setDataDeleteMany([]));
        onClose();
      } catch (error) {
        responseError(error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Modal onClose={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-[425px] h-[200px] rounded-lg shadow-md bg-white"
      >
        <div className="p-4 border-b">
          <HeaderModal
            titile={t('admin.confirm_delete')}
            onClose={onClose}
            className={"font-semibold"}
          />
        </div>
        <div className="flex-center gap-6 mt-4 mx-4">
          <div>
            <TriangleAlert className="w-8 h-8 text-neutral2" />
          </div>
          <h3 className="text-sm  font-medium">{title}</h3>
        </div>
        <div className="text-end border-t mt-4 p-4 space-x-4">
          <button
            aria-label={t('common.cancel')}
            type="submit"
            disabled={loading}
            className="btn w-24 h-8.5 bg-gray-100 disabled:bg-gray-200  text-gray-800 border-gray-200 border hover:text-white"
            onClick={() => onClose()}
          >
            {loading ? t('common.loading') : t('common.no')}
          </button>
          <button
            aria-label={t('common.yes')}
            type="submit"
            disabled={loading}
            onClick={handleDelete}
            className="btn w-24 h-8.5 disabled:bg-gray-800"
          >
            {loading ? t('common.loading') : t('common.yes')}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteManyModal;
