/** @format */

import React, { useState } from "react";
import CoachInputForm from "./CoachInputForm";
import CoachOutputForm from "./CoachOutputForm";

const CoachProfile = ({
  CountCoachData,
  AddCoachData,
  AddCoach,
  role,
  user,
}) => {
  return (
    <div>
      <CoachInputForm AddCoachData={AddCoachData} />
      <CoachOutputForm
        AddCoach={AddCoach}
        CountCoachData={CountCoachData}
        role={role}
        user={user}
      />
    </div>
  );
};

export default CoachProfile;
