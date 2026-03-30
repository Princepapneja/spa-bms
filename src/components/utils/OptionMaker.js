export const OptionMaker = (data, keys = { name: "name", value: "_id" }) => {
    // Always work with an array
    const arr = Array.isArray(data) ? data : data ? [data] : [];
  console.log(data)
    return [
      // { name: "Select an option", value: "" },
      ...arr.map((e) => {
        if (typeof e === "object" && e !== null) {
          return {
            name: e[keys?.name],
            value: e[keys?.value],
          };
        } else {
          return {
            name: String(e),
            value: String(e),
          };
        }
      }),
    ];
  };
  