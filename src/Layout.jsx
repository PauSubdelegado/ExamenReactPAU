import { Outlet } from "react-router-dom";
import Footer from "./pages/Footer";
import Header from "./pages/Header";

export default function Layout() {
  
  return (
    <>
     <div className="tablon-wrap d-flex flex-column rounded-3 overflow-hidden border">

      <Header />

      <main>
        <div className="tablon-board flex-grow-1 position-relative p-4">
          <div className="tablon-cork" />

        <Outlet />
    
      </div>
      
       </main>

      <Footer />
      </div>
    </>
  );
}