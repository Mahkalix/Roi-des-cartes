import React from "react";
import PropTypes from "prop-types";
import "../styles/components/_controls.scss"; // Incluez les styles des contrôles ici

const Controls = ({ onMove }) => {
    return (
        <div className="controls-container">
            <div className="controls">
                <button
                    onClick={() => onMove("UP")}
                    className="button-up"
                    tabIndex="0"
                    aria-label="Move Up"
                >
                    ↑
                </button>
                <button
                    onClick={() => onMove("LEFT")}
                    className="button-left"
                    tabIndex="0"
                    aria-label="Move Left"
                >
                    ←
                </button>
                <button
                    onClick={() => onMove("RIGHT")}
                    className="button-right"
                    tabIndex="0"
                    aria-label="Move Right"
                >
                    →
                </button>
                <button
                    onClick={() => onMove("DOWN")}
                    className="button-down"
                    tabIndex="0"
                    aria-label="Move Down"
                >
                    ↓
                </button>
            </div>
        </div>
    );
};

Controls.propTypes = {
    onMove: PropTypes.func.isRequired, // Fonction de gestion des mouvements
};

export default Controls;
