import React, {  useEffect } from 'react';
import AddItem from './addItem';

const ItemList = ({ isFeedActive, items, setItems }) => {
    // const [items, setItems] = useState([]);

    useEffect(() => {
        if (isFeedActive) {
            const interval = setInterval(() => {
                fetch('http://localhost:5001/item_list')
                    .then(response => response.json())
                    .then(data => setItems(data));
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [isFeedActive, setItems]);

    const handleAddItem = (newItem) => {
        fetch('http://localhost:5001/add_item', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ item: newItem }),
        })
            .then(response => response.json())
            .then(data => {
                // Assuming the backend returns the updated list with no duplicates
                setItems(data);
            });
    };

    return (
        <div style={styles.container}>
            <AddItem onAddItem={handleAddItem} />
            <h3>Detected Items:</h3>
            {!isFeedActive ? (
                <p style={styles.waitingText}>Waiting to scan...</p>
            ) : (
                <ul style={styles.list}>
                    {items.map((item, index) => (
                        <li key={index} style={styles.listItem}>
                            {item}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

const styles = {
    container: {
        position: 'fixed',
        top: '40px',
        left: '680px',
        padding: '20px',
        border: '1px solid black',
        borderRadius: '5px',
        width: '220px',
        backgroundColor: '#f9f9f9',
        zIndex: 1000,
        maxHeight: '700px',
        overflowY: 'auto', // Enable vertical scrolling
    },
    list: {
        listStyleType: 'none',
        padding: 0,
        margin: 0,
    },
    listItem: {
        padding: '10px',
        borderBottom: '1px solid #ddd',
    },
    waitingText: {
        color: '#999',
        fontStyle: 'italic',
    },
};

export default ItemList;