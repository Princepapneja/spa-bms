import {
  Eye,
  EyeOff,
  Trash,
  UploadCloud,
  ChevronUp,
  ChevronDown,
  Search,
} from "lucide-react";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import Buttons from "./Buttons";
import { OptionMaker } from "./OptionMaker";

const Inputs = ({
  label,
  className,
  disabled,
  options,
  deleteCta,
  type = "text",
  id,
  name,
  value,
  max,
  onChange,
  placeholder = "",
  checked,
  prefix = false,
  subLabel = false,
  accept,
  multiple,
  fileKey,
  required = false,
  hook = () => { return false },
  params,
  format
}) => {
  const [showPass, setShowPass] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selected, setSelected] = useState([]);
  const ref = useRef(null);
  const [dataList, setDataList] = useState([]);
  const [skip, setSkip] = useState(0);
  const dropdownRef = useRef(null);

  const limit = 10;

  // call hook inside input
  const { data, loading } = hook({
    ...params,
    search: searchTerm.toLowerCase(),
    skip,
    limit,
  });


  // console.log(data);

  useEffect(() => {
    // debugger
    if (data?.resp?.length > 0) {
      const mapped = OptionMaker(data?.resp || [], format ? format :{
        name: "name",
        value: "id",
      })
      // const mapped = data.resp.map((i) => ({
      //   value: i.id,
      //   name: i.name
      // }));

      // setDataList((prev) => [...prev, ...mapped]);
      if (hook) {
        setDataList((prev) => skip === 0 ? mapped : [...prev, ...mapped]);
        return
      }
    }
    setDataList(options)

  }, [data, options]);



  const safeValue = Array.isArray(value) ? value : [];

  const handleSelect = (e, opt) => {
    debugger

    if (safeValue.includes(opt.value)) {
      let newValues = safeValue.filter((v) => v !== opt.value);
      onChange({ target: { name: e.target.name, value: newValues } });
    } else {
      let newValues = [...safeValue, opt.value];
      onChange({ target: { name: e.target.name, value: newValues } });
    }
  };

  const isSelected = (optValue) =>
    type === "select"
      ? String(value) === String(optValue)
      : safeArrayValue.map(String).includes(String(optValue));

  const getSelectedLabel = () => {
    if (!value) return "Select";
    const list = dataList?.length ? dataList : options;
    const found = list?.find(
      (opt) => String(opt.value) === String(value)
    );
    return found?.name || found?.title || "Select";
  };

  const handleSingleSelect = (e, opt) => {
    e.stopPropagation();
    onChange({
      target: { name, value: String(opt.value || opt.key) },
    });
    setOpen(false);
  };


  // console.log(dataList);
  const handleScroll = (e) => {
    const isBottom =
      Math.ceil(e.target.scrollTop + e.target.clientHeight) >= e.target.scrollHeight - 5;
    if (isBottom && dataList?.length < data?.total && !loading) {
      setSkip((prev) => prev + limit);
    }
  };


  const handleChange = (e) => {
    const { type, value } = e.target;
    if (type === "tel") {
      const numericValue = value.replace(/[^0-9]/g, "");
      e.target.value = numericValue;
    }
    if (type === "checkbox") {
      e = {
        ...e,
        target: { ...e.target, value: e.target.checked, name: e.target.name },
      };
    }
    onChange && onChange(e);
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter options by search
  const filteredData = options?.filter((data) => {
    const dataName = data?.name || data?.title || data?.label;
    return dataName?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // ✅ Handle select/unselect for multi-select
  const handleCheck = (selectedData) => {
    const updatedSelection = selected.some(
      (item) => item.value === selectedData.value
    )
      ? selected.filter((item) => item.value !== selectedData.value)
      : [...selected, selectedData];
    setSelected(updatedSelection);
  };

  // ✅ Send selected values to parent on "Add Filters"
  const handleAddFilter = () => {
    if (onChange) {
      const values = selected.map((item) => item.value);
      onChange({
        target: { name, id, value: values },
      });
    }
    setOpen(false);
  };


  // ✅ Preselect values when value prop changes
  useEffect(() => {
    if (type === "selects" && Array.isArray(value)) {
      const preselected = options?.filter((opt) =>
        value.includes(opt.value)
      ) || [];
      setSelected(preselected);
    }
  }, [value, options, type]);

  // Reset selected when value is cleared
  useEffect(() => {
    if (type === "selects" && !value?.length) {
      setSelected([]);
    }
  }, [value, type]);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);


  const handleClear = () => {

    onChange({
      target: {
        name: id,
        value: [],
      },
    });

    setSearchTerm("");
    setSkip(0);

  };


  useEffect(() => {
  if (open && dropdownRef.current) {
    dropdownRef.current.scrollIntoView({
      behavior: "smooth",
      block: "end",   // 👈 VERY IMPORTANT
      inline: "nearest",
    });
  }
}, [open]);


  return (
    <div
      className={`${className} ${type === "textarea" || type === "textEditor"
        ? "md:col-span-2 xl:col-span-2"
        : type === "checkbox"
          ? "flex flex-row-reverse gap-1 items-center"
          : "space-y-2 w-full"
        } normal-case`}
    >
      {label && (
        <label
          className={`capitalize font-medium block whitespace-nowrap mb-2 space-x-2 ${disabled ? "text-black" : ""
            }`}
          htmlFor={id}
        >
          <p>  {label}{required && <span className="text-red-500"> *</span>}</p>
        </label>
      )}

      {/* ✅ Multi-select dropdown */}
      {type === "multi-select" ? (
        <div className="relative" ref={dropdownRef}>
          <div
            className={`border-1  border-senary  ${disabled ? "bg-quinary/20" : ""} ring-senary placeholder:text-senary rounded p-3  cursor-pointer flex justify-between`}
            onClick={() => { if (disabled) return; setOpen(!open) }}
          >
            <span className="capitalize font-medium flex items-center gap-2">
              Select
              {safeValue?.length > 0 && (
                <span className="bg-primary px-2 py-0.5 rounded text-xs text-white">
                  {safeValue.length}
                </span>
              )}
            </span>
            {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            {/* <ChevronDown size={16} /> */}
          </div>

          {open && (
            <div className="absolute w-full bg-white shadow-md rounded-lg z-50 mt-2 p-3">

              {/* Search */}
              <div className="flex items-center border-1  border-brdr-quinary rounded-md p-2 mb-2">
                <Search size={14} className="mr-2 text-gray-500" />
                <input
                  type="text"
                  className="w-full outline-none"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setSkip(0);
                    setDataList([]);
                    // setHasMore(true);
                  }}
                />
              </div>

              {/* List */}
              <div className="max-h-56 overflow-y-auto " onScroll={handleScroll}>
                {dataList?.map((opt, i) => (
                  <label key={i} className="flex items-center gap-2 py-1">
                    <input
                      type="checkbox"
                      name={name}
                      id={id}
                      checked={safeValue.includes(opt.value)}
                      onChange={(e) => handleSelect(e, opt)}
                      className="w-4 h-4"
                      disabled={disabled}
                    />
                    <span>{opt?.name || opt?.title}</span>
                  </label>
                ))}
                <div className="flex justify-end ">

                  <Buttons
                    size="small"
                    onClick={handleClear}
                  >
                    Clear All
                  </Buttons>
                </div>
                {loading && (
                  <div className="text-center py-2 text-gray-500">Loading...</div>
                )}

                {dataList?.length === 0 && (
                  <div className="text-center py-2 text-gray-400">No results found</div>
                )}
              </div>

            </div>
          )}
        </div>

      ) : type === "select" ? (
        <div className="relative" ref={dropdownRef}>
          <div
            className={`border-1 border-senary  ${disabled ? "bg-quinary/20" : ""} ring-senary placeholder:text-senary rounded p-2  cursor-pointer flex justify-between`}
            onClick={() => { if (disabled) return; setOpen(!open) }}

          >
            <span
              className={`capitalize font-medium ${!value ? "text-gray-400" : ""
                }`}
            >
              {getSelectedLabel()}
            </span>
            {open ? <ChevronUp /> : <ChevronDown />}
          </div>

          {open && (
            <div className="absolute w-full bg-white shadow rounded mt-2 p-3 z-50" ref={dropdownRef}>
              <div className="flex items-center border rounded p-2 mb-2">
                <Search size={14} className="mr-2" />
                <input
                  className="w-full outline-none"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setSkip(0);
                    setDataList([]);
                  }}
                />
              </div>

              <div
                className="max-h-56 overflow-y-auto"
                onScroll={handleScroll}
              >
                {dataList?.map((opt,i) => (
                  <label
                    key={i}
                    className="flex gap-2 py-1 cursor-pointer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected(opt?.value || opt?.key)}
                      onChange={(e) => handleSingleSelect(e, opt)}
                    />
                    {opt.name|| opt?.title|| opt?.label}
                  </label>

                ))}

                {/* <div className="flex justify-end mt-2">
                  <Buttons size="small" onClick={handleClear}>
                    Clear
                  </Buttons>
                </div> */}
              </div>
            </div>
          )}
        </div>


      ) : type === "textarea" ? (
        <textarea
          id={id}
          name={name}
          value={value}
          rows={4}
          placeholder={placeholder}
          disabled={disabled}
          onChange={onChange && onChange}
          className="bg-transparent p-3 text-desc disabled:bg-quinary/20 placeholder:font-light focus:ring-1 outline-none w-full ring-1 border-senary rounded ring-senary"
        ></textarea>
      ) : type === "radio" ? (
        <div className="flex gap-4">
          {options.map((option,i) => (
            <label key={i} className="flex items-center gap-2">
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={handleChange}
                className="accent-primary"
              />
              {option.name || option.value}
            </label>
          ))}
        </div>
      ) : type === "switch" ? (
        <label className="flex justify-start cursor-pointer text-right">
          <input
            type="checkbox"
            name={name}
            id={id}
            onChange={onChange}
            checked={checked ?? value}
            className="sr-only peer"
          />
          <div className="relative text-desc w-11 h-6 bg-denary peer-focus:outline-none rounded-full peer dark:bg-denary peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-septenary after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-septenary after:border-denary after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-senary peer-checked:bg-secondary" />
        </label>
      ) : (
        <div className="flex items-center ring-1 border-senary rounded ring-senary focus:ring-1 outline-none">
          {prefix && prefix()}
          <input
            id={id}
            type={type === "password" ? (showPass ? "text" : "password") : type}
            name={name}
            value={
              type === "file"
                ? undefined
                : type === "date"
                  ? value
                    ? moment(value).format("YYYY-MM-DD")
                    : ""
                  : value ?? ""
            }
            placeholder={placeholder}
            multiple={type === "file" && multiple}
            checked={checked}
            maxLength={type === "tel" ? max : undefined}
            pattern={type === "tel" ? "[0-9]*" : undefined}
            inputMode={type === "tel" ? "numeric" : undefined}
            accept={accept}
            onChange={handleChange}
            className={`w-full px-2 py-2 outline-none focus:ring-senary transition-colors placeholder:text-senary disabled:bg-quinary/20 ${type !== "password" ? "rounded" : "rounded"
              }`}
            disabled={disabled}
          />
          {type === "file" && (
            <div className="cursor-pointer rounded-r-md px-5">
              <UploadCloud />
            </div>
          )}
          {deleteCta && (
            <div
              onClick={deleteCta}
              className="cursor-pointer bg-nonary p-2 rounded-r text-septenary"
            >
              <Trash />
            </div>
          )}
          {
            // type==="file" && value &&    (<img className="w-12 h-12 rounded-full" src={typeof value ==="string" ? value :URL.createObjectURL(value)} alt="" /> )
          }
           
            {
             type==="file" && fileKey &&
            <img className="h-10 w-10 rounded-full" src={value instanceof File
 ? URL.createObjectURL(value) : (fileKey || value)} alt="Driver's License" />
            }
          {type === "password" && (
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="bg-primary/40 text-secondary cursor-pointer px-4 py-3 rounded-r"
            >
              {showPass ? <Eye /> : <EyeOff />}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Inputs;
