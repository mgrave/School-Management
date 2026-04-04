import { Tooltip, ResponsiveContainer, Pie, PieChart, Legend } from "recharts";
import { useTranslation } from "react-i18next";

const PieChartComponent = ({ data, loading }) => {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="w-full h-full flex-center">
        <div className="flex items-center w-3/4 h-full  justify-center px-4 gap-8 animate-pulse duration-500 border-b">
          <div className="w-[140px] h-[140px] rounded-full  bg-backup "></div>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <p className="text-xs h-full w-full flex-center">{t('common.no_data')}</p>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={"100%"} className={"text-xs"}>
      <PieChart width={400} height={400}>
        <Tooltip content={<CustomTooltip />} />
        <Pie data={data} dataKey="totalKelas" nameKey="kelas" />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PieChartComponent;

const CustomTooltip = ({ active, payload }) => {
  const { t } = useTranslation();
  
  if (active && payload && payload.length) {
    const fillColor = payload[0].payload.fill;
    return (
      <div className="p-2 h-6  bg-white border flex items-center text-xs gap-4 rounded-md">
        <p className=" text-xs ">{payload[0].name}</p>
        <div
          className={`w-4 h-4 rounded-sm`}
          style={{ background: fillColor }}
        ></div>
        <p className="text-xs text-neutral">
          <span className="ml-2">{payload[0].value} {t('common.quantity')}</span>
        </p>
      </div>
    );
  }
};
