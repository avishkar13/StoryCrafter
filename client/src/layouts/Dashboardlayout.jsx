import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

const DashboardLayout = () => {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      {/* Topbar takes full width */}
      <Topbar />

      {/* Below topbar, sidebar and content side-by-side */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 bg-gray-100 p-4 overflow-auto ">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
