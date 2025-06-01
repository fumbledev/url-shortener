import Header from "@/components/Header";
import {Outlet} from "react-router-dom";

const AppLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="container flex-grow">
        <Header />
        <Outlet />
      </main>
      <footer className="p-6 text-center bg-gray-800 text-gray-300 mt-10">
        Made with 💗 by Udanth
      </footer>
    </div>
  );
};

export default AppLayout;
