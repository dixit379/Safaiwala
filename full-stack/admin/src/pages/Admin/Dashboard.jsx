import React, { useContext, useEffect } from 'react';
import { assets } from '../../assets/assets';
import { AdminContext } from '../../context/AdminContext';
import { AppContext } from '../../context/AppContext';

const Dashboard = () => {
  const { aToken, getDashData, cancelAppointment, dashData } = useContext(AdminContext);
  const { slotDateFormat } = useContext(AppContext);

  useEffect(() => {
    if (aToken) {
      getDashData();
    }
  }, [aToken]);

  // Debugging logs
  console.log("Dashboard Data:", dashData);

  if (!dashData) {
    return <p className="text-center mt-10 text-gray-600">Loading Dashboard...</p>;
  }

  return (
    <div className="m-5">
      {/* Statistics Cards */}
      <div className="flex flex-wrap gap-3">
        <StatCard icon={assets.patients_icon} label="ServiceMen" count={dashData.doctors || 0} />
        <StatCard icon={assets.appointments_icon} label="Bookings" count={dashData.appointments || 0} />
        <StatCard icon={assets.patients_icon} label="Users" count={dashData.patients || 0} />
      </div>

      {/* Latest Bookings */}
      {/* <div className="bg-white mt-10 border rounded-lg shadow-md">
        <div className="flex items-center gap-2.5 px-4 py-4 border-b">
          <img src={assets.list_icon} alt="List Icon" />
          <p className="font-semibold">Latest Bookings</p>
        </div>

        <div className="pt-4">
          {dashData.latestAppointments && dashData.latestAppointments.length > 0 ? (
            dashData.latestAppointments.slice(0, 5).map((item, index) => (
              <BookingItem key={index} item={item} cancelAppointment={cancelAppointment} slotDateFormat={slotDateFormat} />
            ))
          ) : (
            <p className="text-center text-gray-600 py-4">No recent bookings found.</p>
          )}
        </div>
      </div> */}
    </div>
  );
};

const StatCard = ({ icon, label, count }) => (
  <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 shadow-sm hover:scale-105 transition-all">
    <img className="w-14" src={icon} alt={label} />
    <div>
      <p className="text-xl font-semibold text-gray-600">{count}</p>
      <p className="text-gray-400">{label}</p>
    </div>
  </div>
);

const BookingItem = ({ item, cancelAppointment, slotDateFormat }) => (
  <div className="flex items-center px-6 py-3 gap-3 hover:bg-gray-100 border-b">
    <img className="rounded-full w-10" src={item.docData?.image || assets.default_avatar} alt="Doctor" />
    <div className="flex-1 text-sm">
      <p className="text-gray-800 font-medium">{item.docData?.name || "Unknown"}</p>
      <p className="text-gray-600">Booking on {item.slotDate ? slotDateFormat(item.slotDate) : "N/A"}</p>
    </div>
    {item.cancelled ? (
      <p className="text-red-400 text-xs font-medium">Cancelled</p>
    ) : item.isCompleted ? (
      <p className="text-green-500 text-xs font-medium">Completed</p>
    ) : (
      <img onClick={() => cancelAppointment(item._id)} className="w-10 cursor-pointer" src={assets.cancel_icon} alt="Cancel" />
    )}
  </div>
);

export default Dashboard;
