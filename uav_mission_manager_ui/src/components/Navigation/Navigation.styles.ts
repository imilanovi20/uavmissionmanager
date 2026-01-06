import { Link } from "react-router-dom";
import styled from "styled-components";

export const NavigationContainer = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background-color: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
`;

export const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
`;

export const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  font-size: 1.125rem;
  color: #2e2e2e;
`;

export const DroneIcon = styled.span`
  font-size: 1.25rem;
`;

export const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
`;

export const NavLink = styled(Link)`
  color: #2e2e2e;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
 
  &:hover {
    color: #404040;
  }
 
  &.active {
    color: #1a1a1a;
  }
`;

export const UserSection = styled.div`
  display: flex;
  align-items: center;
`;

export const UserDropdownContainer = styled.div`
  position: relative;
`;

export const UserAvatar = styled.img`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e5e7eb;
  cursor: pointer;
  transition: border-color 0.2s ease;
 
  &:hover {
    border-color: #667eea;
  }
`;

export const UserDropdown = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 200px;
  z-index: 1000;
  display: ${({ isOpen }) => isOpen ? 'block' : 'none'};
`;

export const UserInfo = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  gap: 2px;

  strong {
    font-size: 14px;
    color: #2e2e2e;
    font-weight: 600;
  }

  span {
    font-size: 12px;
    color: #6b7280;
  }
`;

export const DropdownItem = styled.div`
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-size: 14px;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background-color: #f3f4f6;
  }

  &:last-child {
    border-radius: 0 0 8px 8px;
  }

  &:last-child:hover {
    background-color: #fee2e2;
    color: #dc2626;
  }
`;