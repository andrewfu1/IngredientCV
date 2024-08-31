import React, { useState } from 'react';

const VideoFeed = ({onStart}) => {
    const [isFeedActive, setIsFeedActive] = useState(false);

    const startWebcamFeed = () => {
        setIsFeedActive(true);
        onStart();
    };

    return (
        <div style={styles.container}>
            <div style={styles.feedContainer}>
                {!isFeedActive ? (
                    <button onClick={startWebcamFeed} style={styles.button}>
                        Start Scan
                    </button>
                ) : (
                    <img
                        src="http://localhost:5001/video_feed"
                        alt="Video Feed"
                        style={styles.video}
                    />
                )}
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        height: '100vh',
        paddingLeft: '20px',
        paddingTop: '20px',
    },
    heading: {
        marginBottom: '20px',
        textAlign: 'left',
    },
    feedContainer: {
        width: '640px',
        height: '480px',
        border: '2px solid #ccc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '20px',
    },
    button: {
        padding: '10px 20px',
        fontSize: '16px',
        cursor: 'pointer',
    },
    video: {
        width: '640px',
        height: '480px',
    },
};

export default VideoFeed;