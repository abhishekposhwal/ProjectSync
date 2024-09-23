import React from "react";

// components

import CardTable from "components/Cards/CardTable.js";

export default function Tables() {

  const columns = ["Course Name", "Description", "Duration"];
  const data = [
    { "Course Name": "React Basics", "Description": "Learn the basics of React.", "Duration": "3 weeks" },
    { "Course Name": "Advanced React", "Description": "Dive deeper into React.", "Duration": "4 weeks" },
    { "Course Name": "React with Redux", "Description": "State management with Redux.", "Duration": "2 weeks" },
    { "Course Name": "React with Redux", "Description": "State management with Redux.", "Duration": "2 weeks" }
  ];
  const addButtonName = "Add New Course";
  return (
    <>
      <div className="flex flex-wrap mt-4">
        <div className="w-full mb-12 px-4">
          <CardTable color="light" columns={columns} data={data} addButtonName={addButtonName} />
        </div>
        {/* <div className="w-full mb-12 px-4">
          <CardTable color="dark" />
        </div> */}
      </div>
    </>
  );
}
