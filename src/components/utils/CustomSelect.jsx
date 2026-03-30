"use client";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp, Search, X } from "lucide-react";

const CustomSelect = ({
  value,
  dataKey = "resp",
  onChange,
  name,
  placeholder = "Select",
  disabled,
  hook,
  params = {},
  format = { name: "name", value: "id" },
  multi = false, // ✅ new prop for multi-select
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [dataList, setDataList] = useState([]);

  const dropdownRef = useRef(null);

  // 🔥 API CALL (PAGE BASED)
  const { data, loading } = hook({
    ...params,
    search,
    page,
  });

  const pagination = data?.data?.data?.list?.pagination || {};
  const totalPages = pagination?.lastPage || 1;
  const currentPage = pagination?.currentPage || 1;

  // 🔥 MAP DATA
  const mapData = (list) =>
    list.map((i) => ({
      name: i[format.name],
      value: i[format.value],
      item: i,
    }));

  // 🔥 HANDLE DATA (APPEND BASED ON PAGE)
  useEffect(() => {
    const apiList = data?.data?.data?.list?.[dataKey] || [];
    if (apiList.length > 0) {
      const mapped = mapData(apiList);
      setDataList((prev) => (page === 1 ? mapped : [...prev, ...mapped]));
    }
  }, [data, page, dataKey]);

  // 🔥 SCROLL PAGINATION (PAGE BASED)
  const handleScroll = (e) => {
    const isBottom =
      Math.ceil(e.target.scrollTop + e.target.clientHeight) >=
      e.target.scrollHeight - 5;
    if (isBottom && currentPage < totalPages && !loading) {
      setPage((prev) => prev + 1);
    }
  };

  // 🔥 SEARCH RESET
  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
    setDataList([]);
  };

  // 🔥 SELECT
  const handleSelect = (opt, item) => {
    if (multi) {
      let newValue = Array.isArray(value) ? [...value] : [];
      // Toggle selection
      const exists = newValue.find((v) => String(v.value) === String(opt.value));
      if (exists) {
        newValue = newValue.filter((v) => String(v.value) !== String(opt.value));
      } else {
        newValue.push({ value: opt.value, item });
      }
      onChange({ target: { name, value: newValue } });
    } else {
      onChange({ target: { name, value: opt.value, item } });
      setOpen(false);
    }
  };

  // 🔥 REMOVE SELECTED ITEM (multi)
  const removeItem = (val) => {
    if (!multi) return;
    const newValue = value.filter((v) => String(v.value) !== String(val));
    onChange({ target: { name, value: newValue } });
  };

  // 🔥 SELECTED LABEL
  const selectedLabel = multi
    ? ""
    : dataList.find((d) => String(d.value) === String(value))?.name || placeholder;

  // 🔥 OUTSIDE CLICK
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* SELECT BOX */}
      <div
        className={`border rounded px-3 py-2 flex justify-between flex-wrap cursor-pointer ${
          disabled ? "bg-gray-100" : ""
        }`}
        onClick={() => !disabled && setOpen(!open)}
      >
        {multi && Array.isArray(value) && value.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {value.map((v) => (
              <span
                key={v.value}
                className="bg-gray-200 px-2 py-1 rounded flex items-center gap-1"
              >
                {v.item?.[format.name] || v.value}
                <X size={12} className="cursor-pointer" onClick={(e) => {
                  e.stopPropagation();
                  removeItem(v.value);
                }} />
              </span>
            ))}
          </div>
        ) : (
          <span className={!value || (multi && value.length === 0) ? "text-gray-400" : ""}>
            {selectedLabel}
          </span>
        )}
        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </div>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute w-full bg-white shadow rounded mt-2 z-50">
          {/* SEARCH */}
          <div className="flex items-center border-b px-2 py-2">
            <Search size={14} />
            <input
              className="w-full outline-none ml-2"
              placeholder="Search..."
              value={search}
              onChange={handleSearch}
            />
          </div>

          {/* LIST */}
          <div className="max-h-60 overflow-y-auto" onScroll={handleScroll}>
            {dataList.map((opt, i) => (
              <div
                key={i}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelect(opt, opt?.item)}
              >
                {opt.name}
                {multi && Array.isArray(value) && value.some((v) => String(v.value) === String(opt.value)) && (
                  <span className="text-green-500 ml-2">✓</span>
                )}
              </div>
            ))}

            {/* LOADING */}
            {loading && (
              <div className="text-center py-2 text-gray-500">Loading...</div>
            )}

            {/* EMPTY */}
            {!loading && dataList.length === 0 && (
              <div className="text-center py-2 text-gray-400">No results found</div>
            )}

            {/* END MESSAGE */}
            {!loading && currentPage === totalPages && (
              <div className="text-center py-2 text-gray-300 text-xs">No more data</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomSelect;