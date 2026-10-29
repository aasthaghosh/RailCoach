import React, { useState } from 'react'
import MaintenanceTaskInputForm from './MaintenanceTaskInputForm'
import MaintenanceTaskOutputForm from './MaintenanceTaskOutputForm'

const MaintenanceTask = ({ AddMaintenaceData, AddMaintenace, ContTask, deleteTask }) => {
    // State to hold the list of coaches for the dropdown
    const [coachList, setCoachList] = useState([]);

    return (
        // Global background and font for a professional portal look
        <div className="min-h-screen bg-gray-50 font-sans">
            
            {/* TOP HEADER / CONTROL BAR (Inspired by reference image) */}
            <div className="bg-white border-b border-gray-200 shadow-sm py-4 mb-8">
                <div className="max-w-full mx-auto px-8 flex justify-between items-center">
                    
                    {/* Page Main Title */}
                    <h1 className="text-2xl font-extrabold text-gray-800">
                        RailCoach Maintenance Dashboard
                    </h1>
                    
                    {/* Action Button (Renders the button from the Input Form component) */}
                    <MaintenanceTaskInputForm 
                        AddMaintenaceData={AddMaintenaceData} 
                        coachList={coachList} 
                        setCoachList={setCoachList} 
                    />
                </div>
            </div>

            {/* MAIN DASHBOARD CONTENT AREA */}
            <MaintenanceTaskOutputForm 
                AddMaintenace={AddMaintenace} 
                ContTask={ContTask} 
                deleteTask={deleteTask} 
                coachList={coachList} 
            />
            
        </div>
    )
}

export default MaintenanceTask