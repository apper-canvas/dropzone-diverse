import React from 'react';

const Input = ({ type = 'text', className, onChange, value, ...props }) => {
    // Filter out custom props not valid for input element
    const filteredProps = { ...props };

    return (
        <input
            type={type}
            className={className}
            onChange={onChange}
            value={value}
            {...filteredProps}
        />
    );
};

export default Input;