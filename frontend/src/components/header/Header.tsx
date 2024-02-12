import HeaderTop from "./HeaderTop";
import HeaderBottom from "./HeaderBottom";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useState } from "react";

const Header = () => {
  const [active, setActive] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user)

  window.addEventListener("scroll", () => {
    if (window.scrollY > 70) {
      setActive(true);
    } else {
      setActive(false);
    }
  });
  
  return (
    <header>
      <HeaderTop user={user} />
      <HeaderBottom />
    </header>
  )
}

export default Header