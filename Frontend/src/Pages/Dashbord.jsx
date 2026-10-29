/** @format */

import React from "react";
import CoachProfile from "../Component/DashbordComponent/CoachProfile";

const Dashbord = ({ CountCoachData, AddCoachData, AddCoach, role, user }) => {
  return (
    <div>
      <CoachProfile
        AddCoachData={AddCoachData}
        AddCoach={AddCoach}
        CountCoachData={CountCoachData}
        role={role}
        user={user}
      />
    </div>
  );
};

export default Dashbord;
