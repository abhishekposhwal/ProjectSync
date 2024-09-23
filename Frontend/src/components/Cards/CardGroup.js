import React from "react";
import PropTypes from "prop-types";

export default function CardTable({
  color,
  columns,
  data,
  addButtonName,
  handleOpenModal,
  totalBadgeName,
  groups
}) {
  if (!data || !columns) {
    return null;
  }
  // data = []
  return (
    <>
      <div
        className={`relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded ${color === "light" ? "bg-white" : "bg-gray-800"
          }`}
      >
        <div className="block w-full overflow-x-auto">
          <section className="container px-4 mx-auto">
            <div className="sm:flex sm:items-center sm:justify-between mt-5">
              <h2 className="text-lg font-medium text-gray-800 dark:text-white">
                {totalBadgeName}
              </h2>
              <div className="flex items-center mt-4 gap-x-3">
                {/* <button onClick={refreshTable} class="w-1/2 px-5 py-2 text-sm text-gray-800 transition-colors duration-200 bg-white border rounded-lg sm:w-auto dark:hover:bg-gray-800 dark:bg-gray-900 hover:bg-gray-100 dark:text-white dark:border-gray-700">
                  Refresh
                </button> */}

                {addButtonName && (
                  <button onClick={handleOpenModal} className="flex items-center justify-center w-1/2 px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-blue-500 rounded-lg shrink-0 sm:w-auto gap-x-2 hover:bg-blue-600 dark:hover:bg-blue-500 dark:bg-blue-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>{addButtonName}</span>
                  </button>
                )}

              </div>
            </div>
            <section className="container px-4 mx-auto">
              <div className="flex flex-col mt-6">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">

                    <div class="lg:w-lg overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800 mb-5">
                      {/* <img class="object-cover w-full h-64" src="https://images.unsplash.com/photo-1550439062-609e1531270e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60" alt="Article"> */}

                      <div className="p-6">
                        {groups && groups.length === 0 ? (
                          <div>No groups have been created yet. Please try again or create a new group.</div>
                        ) : (
                          groups && groups.map((group, groupIndex) => (
                            <div key={groupIndex} className="mb-8">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-light text-gray-600 dark:text-gray-400">
                                  Created at {new Date(group.createdAt).toLocaleDateString()}
                                </span>
                                <button className="px-3 py-1 text-sm font-bold text-gray-100 transition-colors duration-300 transform bg-gray-600 rounded cursor-pointer hover:bg-gray-500">
                                  Add
                                </button>
                              </div>
                              <span className="block mt-2 text-xl font-semibold text-gray-800 transition-colors duration-300 transform dark:text-white hover:text-gray-600">
                                {group.name}
                              </span>
                              <div className="mt-4">
                                {group.members.map((member, memberIndex) => (
                                  <div key={memberIndex} className="flex items-center mb-2">
                                    <div className="flex items-center">
                                      <img
                                        className="object-cover md:h-10 h-8 rounded-full"
                                        src={member.avatarUrl}
                                        alt="Avatar"
                                      />
                                      <span className="mx-2 font-semibold text-gray-700 dark:text-gray-200">
                                        {member.name}
                                      </span>
                                    </div>
                                    <span className="mx-1 text-xs text-gray-600 dark:text-gray-300">
                                      {member.rollNumber}
                                    </span>
                                    <span className="mx-1 text-xs text-gray-600 dark:text-gray-300">
                                      {member.section}
                                    </span>
                                    <span className="mx-1 text-xs text-gray-600 dark:text-gray-300">
                                      {member.mobileNumber}
                                    </span>
                                    <span className="mx-1 text-xs text-gray-600 dark:text-gray-300">
                                      {member.course}
                                    </span>
                                    <span className="mx-1 text-xs text-gray-600 dark:text-gray-300">
                                      {member.role}
                                    </span>
                                  </div>
                                ))}
                                {group.member_role === "Mentor" && (
                                  <>
                                    <span className="block text-sm mt-5 font-semibold text-gray-800 transition-colors duration-300 transform dark:text-white hover:text-gray-600">
                                      Mentor
                                    </span>
                                    <div className="mt-4">
                                      <div className="flex items-center">
                                        <div className="flex items-center">
                                          {/* Mentor's avatar URL */}
                                          <img
                                            className="object-cover md:h-10 h-8 rounded-full"
                                            src={group.mentor.avatarUrl}
                                            alt="Mentor Avatar"
                                          />
                                          <span className="font-semibold text-gray-700 dark:text-gray-200">
                                            {group.mentor.name}
                                          </span>
                                        </div>
                                        <span className="mx-2 text-xs text-gray-600 dark:text-gray-300">
                                          {group.mentor.rollNumber}
                                        </span>
                                        <span className="mx-1 text-xs text-gray-600 dark:text-gray-300">
                                          {group.mentor.section}
                                        </span>
                                        <span className="mx-1 text-xs text-gray-600 dark:text-gray-300">
                                          {group.mentor.mobileNumber}
                                        </span>
                                        <span className="mx-1 text-xs text-gray-600 dark:text-gray-300">
                                          {group.mentor.course}
                                        </span>
                                        <span className="mx-1 text-xs text-gray-600 dark:text-gray-300">
                                          Mentor
                                        </span>
                                      </div>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                    </div>

                    {data.length === 0 && (
                      <div className="flex items-center mt-6 text-center border rounded-lg h-96 dark:border-gray-700 mb-5">
                        <div className="flex flex-col w-full max-w-sm px-4 mx-auto">
                          <div className="p-3 mx-auto text-blue-500 bg-blue-100 rounded-full dark:bg-gray-800">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="w-6 h-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                              />
                            </svg>
                          </div>
                          <h1 className="mt-3 text-lg text-gray-800 dark:text-white">
                            No Group found
                          </h1>
                          <p className="mt-2 text-gray-500 dark:text-gray-400">
                            No group has been created yet. Please try again or create a new group.

                          </p>
                          <div className="flex items-center mt-4 sm:mx-auto gap-x-3">
                            {/* <button className="w-1/2 px-5 py-2 text-sm text-gray-700 transition-colors duration-200 bg-white border rounded-lg sm:w-auto dark:hover:bg-gray-800 dark:bg-gray-900 hover:bg-gray-100 dark:text-gray-200 dark:border-gray-700">
                              Clear Search
                            </button> */}
                            {addButtonName && (
                              <button onClick={handleOpenModal} className="flex items-center justify-center w-1/2 px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-blue-500 rounded-lg shrink-0 sm:w-auto gap-x-2 hover:bg-blue-600 dark:hover:bg-blue-500 dark:bg-blue-600">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth="1.5"
                                  stroke="currentColor"
                                  className="w-5 h-5"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                <span>{addButtonName}</span>
                              </button>
                            )}

                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </section>
        </div>
      </div>
    </>
  );
}

CardTable.defaultProps = {
  color: "light",
};

CardTable.propTypes = {
  color: PropTypes.oneOf(["light", "dark"]),
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  addButtonName: PropTypes.string.isRequired,
  totalBadgeName: PropTypes.string.isRequired,
  handleOpenModal: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};
