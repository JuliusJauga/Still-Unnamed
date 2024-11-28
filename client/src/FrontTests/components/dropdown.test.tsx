import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import Dropdown from '../../components/dropdown';
import { useAuth } from '../../context/AuthContext';

vi.mock('../../context/AuthContext', () => ({
    useAuth: vi.fn(),
}));

describe('Dropdown', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        useAuth.mockReturnValue({
            checkUserAuth: vi.fn(),
            isAuthenticated: false,
        });
    });

    test('renders dropdown button', () => {
        render(<Dropdown onSelect={() => {}} />);
        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();
    });

    test('toggles dropdown menu on button click', () => {
        render(<Dropdown onSelect={() => {}} />);
        const button = screen.getByRole('button');
        fireEvent.click(button);
        const menu = screen.getByRole('list');
        expect(menu).toHaveStyle('opacity: 1');
        fireEvent.click(button);
        expect(menu).toHaveStyle('opacity: 0');
    });

    test('calls onSelect with the correct item', () => {
        const handleSelect = vi.fn();
        render(<Dropdown onSelect={handleSelect} />);
        const button = screen.getByRole('button');
        fireEvent.click(button);
        const menuItem = screen.getByText('Profile');
        fireEvent.click(menuItem);
        expect(handleSelect).toHaveBeenCalledWith('Profile');
    });

    test('renders correct menu items based on authentication', () => {
        useAuth.mockReturnValue({
            checkUserAuth: vi.fn(),
            isAuthenticated: true,
        });
        render(<Dropdown onSelect={() => {}} />);
        const button = screen.getByRole('button');
        fireEvent.click(button);
        expect(screen.getByText('Profile')).toBeInTheDocument();
        expect(screen.getByText('Settings')).toBeInTheDocument();
        expect(screen.getByText('Logout')).toBeInTheDocument();
        expect(screen.queryByText('Login')).not.toBeInTheDocument();
    });

    test('renders correct menu items when not authenticated', () => {
        useAuth.mockReturnValue({
            checkUserAuth: vi.fn(),
            isAuthenticated: false,
        });
        render(<Dropdown onSelect={() => {}} />);
        const button = screen.getByRole('button');
        fireEvent.click(button);
        expect(screen.getByText('Login')).toBeInTheDocument();
        expect(screen.queryByText('Profile')).toBeInTheDocument();
        expect(screen.queryByText('Settings')).toBeInTheDocument();
        expect(screen.queryByText('Logout')).not.toBeInTheDocument();
    });

    test('applies hover styles to menu items', () => {
        render(<Dropdown onSelect={() => {}} />);
        const button = screen.getByRole('button');
        fireEvent.click(button);
        const menuItem = screen.getByText('Profile');
        fireEvent.mouseEnter(menuItem);
        expect(menuItem).toHaveStyle('background-color: rgba(240,232,216,0.4)');
        fireEvent.mouseLeave(menuItem);
        expect(menuItem).toHaveStyle('background-color: rgba(0, 0, 0, 0)');
    });
});