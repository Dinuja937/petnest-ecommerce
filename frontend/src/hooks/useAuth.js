import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { clearCartItems } from '../store/slices/cartSlice';

const useAuth = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  const performLogout = () => {
    dispatch(logout());
    dispatch(clearCartItems());
  };

  return {
    userInfo,
    dispatch,
    logout: performLogout,
  };
};

export default useAuth;
