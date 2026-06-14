const StatCard = ({
  title,
  value,
  color,
}) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">

      <p className="text-gray-500">
        {title}
      </p>

      <h2
        className={`text-4xl font-bold mt-3 ${color}`}
      >
        {value}
      </h2>
    </div>
  );
};

export default StatCard;