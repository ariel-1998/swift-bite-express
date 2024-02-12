import React, { useState } from "react";
// import useIsMobile from "../../../hooks/useIsMobile";
import useUserInfo from "../../../hooks/useUserInfo";
import OptionList from "../../OptionsArea/OptionList";

const HeaderMenu: React.FC = () => {
  // const isMobile = useIsMobile();
  const { user } = useUserInfo();
  const [open, setOpen] = useState(false);
  const toggleMenu = () => setOpen((prev) => !prev);
  return (
    <div className="relative ">
      <div
        className="font-semibold text-secondary cursor-pointer "
        onClick={toggleMenu}
      >
        Hello {user?.fullName ?? "Guest"}
      </div>
      {open && <OptionList />}
    </div>
  );
};

export default HeaderMenu;
