import HeaderTop from "./HeaderTop";
import HeaderBottom from "./HeaderBottom";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const Header = () => {
  const user = useSelector((state: RootState) => state.auth.user)

  
  return (
    <header>
      <HeaderTop user={user} />
      <HeaderBottom />
    </header>
  )
}

export default Header