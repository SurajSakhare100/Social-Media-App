import { useState, useEffect } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';

function ThemeToggle() {
    const [isDarkMode, setIsDarkMode] = useState(false);

    const toggleTheme = () => {
        setIsDarkMode(prevMode => !prevMode);
    };
    useEffect(() => {
        document.documentElement.classList.toggle('dark', isDarkMode);
    }, [isDarkMode]);

    return (
        <label className="swap swap-rotate hidden md:flex items-center cursor-pointer" onClick={toggleTheme}>
            {isDarkMode?
            <FaSun className={` h-6 w-6  text-yellow-500`} />
            :<FaMoon className=' w-6 h-6 text-black' />
        }
        </label>
    );
}

export default ThemeToggle;
