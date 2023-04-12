const FilterButtons: React.FC<{
  selectedFilter: string;
  setSelectedFilter: React.Dispatch<React.SetStateAction<string>>;
}> = ({ selectedFilter, setSelectedFilter }) => {
  const filters = ["All", "YTD", "12M", "3M", "1M"];

  return (
    <div className="flex flex-row w-full justify-end gap-3 mt-3">
      {filters.map((filter) => (
        <button
          key={filter}
          className={`h-8 w-12 rounded text-white flex justify-center items-center hover:opacity-50 ${
            selectedFilter === filter ? "bg-blue-500 " : "bg-gray-500 "
          }`}
          onClick={() => setSelectedFilter(filter)}
        >
          {filter}
        </button>
      ))}
    </div>
  );
};

export default FilterButtons;
