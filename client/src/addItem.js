import React, { useState } from 'react';

const AddItem = ({ onAddItem }) => {
    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputValue.trim() !== '') {
            onAddItem(inputValue.trim());
            setInputValue('');
        }
    };

    return (
        <div style={styles.container}>
            <p style={styles.label}>Manually add items:</p>
            <form onSubmit={handleSubmit} style={styles.form}>
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder="Add item"
                    style={styles.input}
                />
                <button type="submit" style={styles.button}>Add</button>
            </form>
        </div>
    );
};

const styles = {
    container: {
        position: 'fixed',
        bottom: '150px',
        left: '180px',
        padding: '20px',
        border: '1px solid black',
        borderRadius: '5px',
        backgroundColor: '#f9f9f9',
        zIndex: 1000,
    },
    form: {
        display: 'flex',
        flexDirection: 'row',
        marginBottom: '20px',
    },
    input: {
        flex: 1,
        padding: '10px',
        fontSize: '16px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        marginRight: '10px',
    },
    button: {
        padding: '10px 20px',
        fontSize: '16px',
        cursor: 'pointer',
        border: '1px solid #ccc',
        borderRadius: '5px',
        backgroundColor: '#007bff',
        color: '#fff',
    },
};

export default AddItem;