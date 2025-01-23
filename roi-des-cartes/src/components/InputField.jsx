import PropTypes from "prop-types";

const InputField = ({ label, type, value, onChange, placeholder }) => {
  return (
    <div className="input-field-container">
      {label && <label className="input-field-label">{label}</label>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="input-field"
      />
    </div>
  );
};

InputField.propTypes = {
  label: PropTypes.string, // Label optionnel pour le champ
  type: PropTypes.string, // Type du champ, ex : "text", "password"
  value: PropTypes.string.isRequired, // Valeur du champ
  onChange: PropTypes.func.isRequired, // Fonction appelée lorsqu'on tape dans le champ
  placeholder: PropTypes.string, // Texte indicatif (facultatif)
};

export default InputField;
