import { Outlet } from "react-router-dom";

const UserLayout = () => {
  return (
    <div>
      <h2 style={{ padding: 16 }}>User Area</h2>
      <Outlet />
    </div>
  );
};

export default UserLayout;
