import React from "react";

// components

// import CardLineChart from "components/Cards/CardLineChart.js";
// import CardBarChart from "components/Cards/CardBarChart.js";
// import CardPageVisits from "components/Cards/CardPageVisits.js";
// import CardSocialTraffic from "components/Cards/CardSocialTraffic.js";
import CardProfile from "components/Cards/CardProfile";

export default function Dashboard() {
  return (
    <>
      <div className="flex flex-wrap">
        <div className="flex flex-wrap  items-center justify-center">
          {/* <div className="w-full lg:w-8/12 px-4">
          <CardSettings />
        </div> */}
          <div className="w-full xl:w-8/12  px-4">
            <CardProfile />
          </div>
        </div>
      </div>
    </>
  );
}
