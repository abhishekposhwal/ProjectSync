import React from "react";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";

function CardSocialTraffic({ headers, data, onSeeAll, tableName }) {
  const history = useHistory();

  const handleSeeAllClick = () => {
    if (onSeeAll) {
      onSeeAll();
    } else {
      history.push('/admin/groups');
    }
  };

  if (!Array.isArray(data)) {
    console.error("Data is not an array:", data);
    return null; // Or render an error message
  }

  return (
    <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
      <div className="rounded-t mb-0 px-4 py-3 border-0">
        <div className="flex flex-wrap items-center">
          <div className="relative w-full px-4 max-w-full flex-grow flex-1">
            <h3 className="font-semibold text-base text-blueGray-700">
              {tableName}
            </h3>
          </div>
          <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
            <button
              className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
              type="button"
              onClick={handleSeeAllClick}
            >
              See all
            </button>
          </div>
        </div>
      </div>
      <div className="block w-full overflow-x-auto">
        <table className="items-center w-full bg-transparent border-collapse">
          <thead className="thead-light">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {/* Check if row is an array before mapping */}
                {Array.isArray(row) &&
                  row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
                    >
                      {cell}
                    </td>
                  ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

CardSocialTraffic.propTypes = {
  headers: PropTypes.arrayOf(PropTypes.string),
  data: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.any)),
  onSeeAll: PropTypes.func,
  tableName: PropTypes.string
};

CardSocialTraffic.defaultProps = {
  headers: ["Group Name", "Members"],
  data: [
    ["Group 01", "3"],
    ["Group 02", "4"],
    ["Group 03", "4"],
    ["Group 04", "3"],
    ["Group 05", "3"]
  ],
  onSeeAll: null,
  tableName: "Projects"
};

export default CardSocialTraffic;
