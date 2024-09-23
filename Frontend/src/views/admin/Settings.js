import React from "react";

// components

// import CardSettings from "components/Cards/CardSettings.js";
import CardProfile from "components/Cards/CardProfile.js";

export default function Settings() {
  return (
    <>
      <div className="flex flex-wrap items-center justify-center">
        {/* <div className="w-full lg:w-6/12 px-4 mt-10">
            <div className="mt-6">
              <CardSettings />
            </div>
          </div> */}
        <div className="w-full lg:w-8/12 px-4">
          <CardProfile />
        </div>
      </div>
    </>
  );
}
