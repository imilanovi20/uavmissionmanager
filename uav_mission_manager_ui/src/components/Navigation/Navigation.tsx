// Navigation.tsx
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { useAuthStore } from "../../stores/authStore";
import { 
  DroneIcon, 
  LeftSection, 
  Logo, 
  NavigationContainer, 
  NavLink, 
  NavLinks, 
  UserAvatar, 
  UserSection,
  UserDropdown,
  UserDropdownContainer,
  DropdownItem,
  UserInfo
} from "./Navigation.styles";
import { LogOut, LucidePlaneTakeoff, User } from "lucide-react";

export const Navigation = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  const defaultImagePath = "/user/default/default-user.jpg";
  const { user } = useCurrentUser();
  const { logout } = useAuthStore();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAvatarClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleProfileClick = () => {
    setIsDropdownOpen(false);
    navigate('/profile');
  };

  const handleLogoutClick = async () => {
    setIsDropdownOpen(false);
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <NavigationContainer>
      <LeftSection>
        <Logo>
          <DroneIcon><LucidePlaneTakeoff size={16} /></DroneIcon>
          UAV Mission Manager
        </Logo>
       
        <NavLinks>
          <NavLink to="/missions">Missions</NavLink>
          <NavLink to="/users">Users</NavLink>
          <NavLink to="/uavs">UAVs</NavLink>
        </NavLinks>
      </LeftSection>
     
      <UserSection>
        <UserDropdownContainer ref={dropdownRef}>
          <UserAvatar
            src={!user || !user.imagePath || user.imagePath === "" || user.imagePath === "/"  
              ? defaultImagePath  
              : user.imagePath}
            alt="User Avatar"
            onClick={handleAvatarClick}
          />
          
          <UserDropdown isOpen={isDropdownOpen}>
            <UserInfo>
              <strong>{user?.username || 'User'}</strong>
              <span>{user?.role || 'Role'}</span>
            </UserInfo>
            
            <DropdownItem onClick={handleProfileClick}>
              <User size={16} />
              Profile
            </DropdownItem>

            <DropdownItem onClick={handleLogoutClick}>
              <LogOut size={16} />
              Logout
            </DropdownItem>
          </UserDropdown>
        </UserDropdownContainer>
      </UserSection>
    </NavigationContainer>
  );
};