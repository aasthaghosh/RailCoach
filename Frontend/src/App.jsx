/** @format */

import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Singup from "./Pages/Singup";
import Dashbord from "./Pages/Dashbord";
import NavBar from "./Component/NavBar";
import MaintenanceTask from "./Component/DashbordComponent/MaintenanceTask";
import { useEffect, useState } from "react";
import LandingPage from "./Pages/LandingPage";
import CoachDetailsPage from "./Pages/CoachDetailsPage";
import DepartmentDashboard from "./Pages/DepartmentDashboard";
import ProtectedRoute from "./Pages/ProtectedRoute";
import AdminPendingTasks from "./Pages/AdminPendingTasks";
import AboutUs from "./Pages/AboutUs";
import NotFound from "./Pages/NotFound";
import AdminUsers from "./Pages/AdminAllUser";
import AdminUserDetails from "./Pages/AdminUserDetails";

function App() {
  //!_______________________________This is the Login_____________________________________
  const [isloggin, setIsloggin] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  // to store the role of the user
  const [role, setRole] = useState();
  const [user, setUser] = useState(null);
  // CHECK LOGIN ON PAGE REFRESH
  // ! page reresh hone ke baad cookies ki help se check krta h ki use login h ki nhi cookis hoti h to aapne app login ho jata h refersh krne ke baad pr kisi ne logout kiya hoga to cookis remove ho gai hogi to vo bina login kiye dashboard p nhi jaa sakta h
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/v1/me", {
          withCredentials: true,
        });
        // to find the role of the user and the user object
        setRole(res.data.role);
        setUser(res.data.user || null);

        if (res.data.loggedIn) {
          setIsloggin(true);
        } else {
          setIsloggin(false);
        }
      } catch (err) {
        setIsloggin(false);
      } finally {
        setAuthLoading(false);
      }
    };

    checkAuth();
  });

  //!________________________________This is the Coach Profile_________________________________
  const [AddCoach, setAddCoach] = useState([]);
  function AddCoachData(coachData) {
    setAddCoach((pre) => [...pre, coachData]);
  }

  // FETCH DATA FROM MONGODB WHEN PAGE LOADS
  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/v1/allcoach", {
          credentials: "include", //  VERY IMPORTANT
        });
        const data = await res.json();

        if (res.ok) {
          setAddCoach(data.coaches); // <-- STORE DB DATA HERE
        } else {
          console.log("Error:", data.message);
        }
      } catch (err) {
        console.log("Fetch Error:", err);
      }
    };

    fetchCoaches();
  }, []);

  const [TotalCoach, setTotalCoach] = useState(0);
  const [ActiveCoach, setActiveCoach] = useState(0);
  const [MaintenanceDueCoach, setMaintenanceDueCoach] = useState(0);
  const [OutOfSericeCoach, setOutOfSericeCoach] = useState(0);
  function CountCoachData(CoachLength) {
    // setTotalCoach( CoachLength)
    // console.log(CoachLength[1].status)
    let active = 0;
    let undermaintenance = 0;
    let out = 0;
    CoachLength.map((coach) => {
      if (coach.status === "active") active++;
      else if (coach.status === "under maintenance") undermaintenance++;
      else out++;
    });
    setActiveCoach(active);
    setMaintenanceDueCoach(undermaintenance);
    setOutOfSericeCoach(out);
    setTotalCoach(CoachLength.length);
  }
  useEffect(() => {
    CountCoachData(AddCoach);
  }, [AddCoach]);

  //!_______________________________________This is the Maintenance Task_____________________________

  const [AddMaintenace, setAddMaintenace] = useState([]);
  function AddMaintenaceData(MaintenanceData) {
    setAddMaintenace((pre) => [...pre, MaintenanceData]);
  }
  // to count the task;
  const [countTask, setCountTask] = useState(0);
  function ContTask(TaskNo) {
    // console.log(TaskNo.length);
    setCountTask(TaskNo.length);
  }
  // FETCH DATA FROM MONGODB WHEN PAGE LOADS
  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/v1/alltaskdata", {
          credentials: "include", //  VERY IMPORTANT
        });
        const data = await res.json();

        if (res.ok) {
          setAddMaintenace(data.tasks); // <-- STORE DB DATA HERE
        } else {
          console.log("Error:", data.message);
        }
      } catch (err) {
        console.log("Fetch Error:", err);
      }
    };

    fetchTask();
  }, []);

  // usestat for the completed task;
  const [completed, setCompleted] = useState(0);

  // delete function for the Task
  function deleteTask(index) {
    // mark task as completed (PATCH) so backend increments counters
    axios
      .patch(
        `http://localhost:4000/api/v1/task/${index}/complete`,
        {},
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        // remove completed task from the approved list shown in UI
        setAddMaintenace((pre) => pre.filter((v) => v._id !== index));
        setCompleted((c) => c + 1);
      })
      .catch((err) => {
        console.error("complete task error", err.response || err);
      });
  }

  //!_______________________________________Coach update____________________________________________
  function UpdateCoachData(id, updatedData) {
    setAddCoach((prev) => {
      const newArr = [...prev];
      newArr[id] = updatedData;
      return newArr;
    });
  }

  /* ===================== LOADING STATE ===================== */
  if (authLoading) {
    return <div className="text-center mt-20 text-xl">Checking login...</div>;
  }

  return (
    <div>
      <NavBar
        isloggin={isloggin}
        setIsloggin={setIsloggin}
        role={role}
        user={user}
      />
      <ToastContainer />

      <Routes>
        {/* this is old route */}
        {/* <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<Home TotalCoach={TotalCoach} ActiveCoach={ActiveCoach} MaintenanceDueCoach={MaintenanceDueCoach} OutOfSericeCoach={OutOfSericeCoach} />} />
        <Route path="/maintenance" element={<MaintenanceTask AddMaintenaceData={AddMaintenaceData} AddMaintenace={AddMaintenace} ContTask={ContTask} deleteTask={deleteTask} />} />
        <Route path="/login" element={<Login setIsloggin={setIsloggin} />} />
        <Route path="/singup" element={<Singup setIsloggin={setIsloggin} />} />
        <Route path="/coachprofile" element={<Dashbord AddCoachData={AddCoachData} AddCoach={AddCoach} CountCoachData={CountCoachData} />} />
        <Route path="/coach/:id" element={<CoachDetailsPage AddCoach={AddCoach} UpdateCoachData={UpdateCoachData} />} />
        <Route path="/departments" element={<DepartmentDashboard AddMaintenance={AddMaintenace} countTask={countTask} completed={completed} />}/>
        <Route path="/admin/pending-tasks" element={<AdminPendingTasks />}/>
        <Route path="/about" element={<AboutUs/>}/> */}

        {/* ⁡⁢⁣⁢this is the new Route use in future⁡ */}
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute isloggin={isloggin}>
              <Home
                TotalCoach={TotalCoach}
                ActiveCoach={ActiveCoach}
                MaintenanceDueCoach={MaintenanceDueCoach}
                OutOfSericeCoach={OutOfSericeCoach}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/maintenance"
          element={
            <ProtectedRoute isloggin={isloggin}>
              <MaintenanceTask
                AddMaintenaceData={AddMaintenaceData}
                AddMaintenace={AddMaintenace}
                ContTask={ContTask}
                deleteTask={deleteTask}
              />
            </ProtectedRoute>
          }
        />

        <Route path="/login" element={<Login setIsloggin={setIsloggin} />} />

        <Route
          path="/coachprofile"
          element={
            <ProtectedRoute isloggin={isloggin}>
              <Dashbord
                AddCoachData={AddCoachData}
                AddCoach={AddCoach}
                CountCoachData={CountCoachData}
                role={role}
                user={user}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/coach/:id"
          element={
            <ProtectedRoute isloggin={isloggin}>
              <CoachDetailsPage
                AddCoach={AddCoach}
                UpdateCoachData={UpdateCoachData}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/departments"
          element={
            <ProtectedRoute isloggin={isloggin}>
              <DepartmentDashboard
                AddMaintenance={AddMaintenace}
                countTask={countTask}
                completed={completed}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/pending-tasks"
          element={
            <ProtectedRoute isloggin={isloggin}>
              <AdminPendingTasks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/user/:id"
          element={
            <ProtectedRoute isloggin={isloggin}>
              <AdminUserDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/about"
          element={
            <ProtectedRoute isloggin={isloggin}>
              <AboutUs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/singup"
          element={
            <ProtectedRoute isloggin={isloggin}>
              <Singup setIsloggin={setIsloggin} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/all_user"
          element={
            <ProtectedRoute isloggin={isloggin}>
              <AdminUsers />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
