import { useState, useEffect } from "react";
import { sociosApi } from "../../../api/enpoints/sociosApi";
import { rolesApi } from "../../../api/enpoints/rolesApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const useSocioForm = (socioId = null) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    confirmarPassword: "",
    telefono: "",
    idRol: "",
    activo: true,
  });

  // Cargar roles disponibles
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const data = await rolesApi.getAll();
        setRoles(data);
        // Si no hay rol seleccionado, poner el primero por defecto
        if (!formData.idRol && data.length > 0) {
          setFormData((prev) => ({ ...prev, idRol: data[0].idRol }));
        }
      } catch (err) {
        console.error("Error al cargar roles:", err);
        toast.error("Error al cargar roles");
      }
    };
    fetchRoles();
  }, []);

  // Cargar datos del socio si es edición
  useEffect(() => {
    if (socioId) {
      const fetchSocio = async () => {
        try {
          const data = await sociosApi.getById(socioId);
          setFormData({
            nombre: data.nombre,
            email: data.email,
            password: "", // No cargamos el password
            confirmarPassword: "",
            telefono: data.telefono || "",
            idRol: data.idRol,
            activo: data.activo,
          });
        } catch (err) {
          console.error("Error al cargar socio:", err);
          toast.error("Error al cargar socio");
        }
      };
      fetchSocio();
    }
  }, [socioId]);

  // Manejar cambios en inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Validar formulario
  const validateForm = () => {
    // Validar nombre
    if (!formData.nombre.trim()) {
      toast.error("El nombre es obligatorio");
      return false;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      toast.error("El email es obligatorio");
      return false;
    }
    if (!emailRegex.test(formData.email)) {
      toast.error("El formato del email no es válido");
      return false;
    }

    // Validar password (solo al crear)
    if (!socioId) {
      if (!formData.password) {
        toast.error("El password es obligatorio");
        return false;
      }
      if (formData.password.length < 6) {
        toast.error("El password debe tener al menos 6 caracteres");
        return false;
      }
      if (formData.password !== formData.confirmarPassword) {
        toast.error("Los passwords no coinciden");
        return false;
      }
    }

    // Validar rol
    if (!formData.idRol) {
      toast.error("Debes seleccionar un rol");
      return false;
    }

    return true;
  };

  // Guardar socio
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      if (socioId) {
        // Actualizar (sin password)
        const dataToSend = {
          nombre: formData.nombre,
          email: formData.email,
          telefono: formData.telefono,
          idRol: parseInt(formData.idRol),
          activo: formData.activo,
        };
        await sociosApi.update(socioId, dataToSend);
        toast.success("Socio actualizado correctamente");
      } else {
        // Crear nuevo
        const dataToSend = {
          nombre: formData.nombre,
          email: formData.email,
          password: formData.password,
          telefono: formData.telefono,
          idRol: parseInt(formData.idRol),
        };
        await sociosApi.create(dataToSend);
        toast.success("Socio creado correctamente");
      }

      navigate("/usuarios");
    } catch (err) {
      const errorMsg = err.response?.data || "Error al guardar socio";
      toast.error(errorMsg);
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    handleChange,
    handleSubmit,
    loading,
    roles,
  };
};
