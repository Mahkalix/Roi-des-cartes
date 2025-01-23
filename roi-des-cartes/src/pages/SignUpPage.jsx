import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Signup = () => {
  const [formData, setFormData] = useState({ name: "", username: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    setError("");

    try {
      let response = await fetch("https://g1s5d.22.gremmi.fr/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      let data = await response.json();
      console.log("Server response:", data);
      console.log("userId", data.userId);

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId); // Correctement stocké
        console.log("Utilisateur inscrit avec succès :", data);
        navigate("/login");

    } else if (data.message === "Username already taken") {
        setError("Le nom d'utilisateur est déjà utilisé.");
      } else {
        setError("Erreur lors de l'inscription.");
      }
    } catch (err) {
      setError("Une erreur s'est produite. Veuillez réessayer.");
      console.error(err);
    }
  };

  return (
    <div className="form-container-signUp">
      <div>
        <h1 className="title-signUp">Inscription </h1>
        <form className="input-container" onSubmit={handleSignup}>
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
            S&apos;inscrire
          </button>
        </form>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default Signup;
