import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Login = () => {
  const [formData, setFormData] = useState({ name: "", username: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    setError("");

    try {
      let response = await fetch("https://g1s5d.22.gremmi.fr/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      let data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId);
        console.log("Utilisateur connecté avec succès :", data);
        navigate("/game1");
      } else {
        setError("Erreur lors de la connexion.");
      }
    } catch (err) {
      setError("Une erreur s'est produite. Veuillez réessayer.");
      console.error(err);
    }
  };

  const handleNavigateToSignup = () => {
    navigate("/signup");
  };

  return (
    <div className="form-container-signUp">
      <>
        <h1 className="title-signUp">Connexion</h1>
        <form className="input-container" onSubmit={handleLogin}>
          <input
            className="input-field"
            type="text"
            name="username"
            placeholder="Pseudo"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
          <input
            className="input-field"
            type="text"
            name="name"
            placeholder="Nom"
            value={formData.name}
            onChange={handleInputChange}
          />
          <button type="submit" className="submit-button">
            Se connecter
          </button>
        </form>
        <button
          onClick={handleNavigateToSignup}
          className="submit-button"
          style={{ marginTop: "15px" }}
        >
          S&apos;inscrire
        </button>
        {error && (
          <p className="error-message" style={{ marginTop: "5px" }}>
            {error}
          </p>
        )}
      </>
    </div>
  );
};

export default Login;
