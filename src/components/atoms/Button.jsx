import React from 'react';

const Button = ({ onClick, children, className, type = 'button', ...props }) => {
    // Filter out custom props not valid for button element
    const filteredProps = { ...props };

    return (
        <button type={type} onClick={onClick} className={className} {...filteredProps}>
            {children}
        </button>
    );
};

export default Button;