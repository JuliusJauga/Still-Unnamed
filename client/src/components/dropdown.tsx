import React, { useState, CSSProperties, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
interface DropdownProps {
    onSelect: (item: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ onSelect }) => {
    // eslint-disable-next-line
    const {checkUserAuth, isAuthenticated} = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isClicked, setIsClicked] = useState(false);
    
    const buttonRef = useRef<HTMLButtonElement>(null);

    const toggleDropdown = () => {
        checkUserAuth();
        setIsOpen(!isOpen);
    };

    const selectItem = (item: string) => {
        setIsOpen(false);  // Close dropdown on item selection
        onSelect(item);    // Call the passed-in callback function
    };

    const buttonStyle: CSSProperties = {
        opacity: isClicked ? 0.95 : 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'transform 0.4s ease',
        outline: 'none',
        borderRadius: '0.6vw',
        border: '0.2vw solid var(--borderColor)',
        backgroundColor: 'transparent',
        color: 'var(--textColor)',
        transform: isHovered ? 'scale(0.95)' : 'scale(1)',
        fontSize: '26px',
        fontFamily: 'var(--fontStyle)', 
        cursor: 'pointer', 
        height: '100%',
        aspectRatio: '1/1',
        zIndex: 99,
        boxSizing: 'border-box', 
        paddingBottom: '3px'
    };

    const dropdownMenuStyle: CSSProperties = {
        position: 'absolute',
        top: '100%',
        left: 'auto',
        right: '0',  // Align the dropdown with the button's right side
        border: '4px solid var(--borderColor)',
        backgroundColor: 'transparent',
        
        listStyle: 'none',
        padding: '0',
        margin: '0',
        width: 'auto',
        minWidth: '100px', 
        boxSizing: 'border-box',
        zIndex: 100,
        borderRadius: '12px',
        opacity: isOpen ? 1 : 0,
        transform: isOpen ? 'scale(1)' : 'scale(0)', // Scale dropdown menu on open/close
        transformOrigin: 'top right',
        transition: 'opacity 0.4s ease, transform 0.4s ease', // Smooth transition
        whiteSpace: 'nowrap',
    };

    const menuItemStyle: CSSProperties = {
        padding: '10px 20px',
        cursor: 'pointer',
        color: 'var(--textColor)',
        fontSize: '20px',
        fontFamily: 'var(--fontStyle)', 
        whiteSpace: 'nowrap',
    };

    const menuItemHoverStyle: CSSProperties = {
        backgroundColor: 'rgba(240,232,216,0.4)',
    };

    return (
        <div className="dropdown" style={{ position: 'relative', height: '100%', width: '50%' }}>  {/* width of the dropdown */}
            <button
                ref={buttonRef}
                role="button"
                onClick={toggleDropdown}
                style={buttonStyle}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => {
                    setIsHovered(false);
                    setIsClicked(false);
                }}
                onMouseDown={() => setIsClicked(true)}
                onMouseUp={() => setIsClicked(false)}
            >
                <i className="fas fa-bars"></i>
            </button>
            <ul style={dropdownMenuStyle}>
                {['Profile', 'Settings', isAuthenticated ? 'Logout' : 'Login'].map((option, index) => (
                    <li
                        key={index}
                        style={menuItemStyle}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = menuItemHoverStyle.backgroundColor || 'rgba(240,232,216,0.4)')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                        onClick={() => selectItem(option)}
                    >
                        {option}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Dropdown;
