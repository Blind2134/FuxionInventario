import { useState, useEffect } from "react";
import { rolesApi } from "../../../api/enpoints/rolesApi";
import { toast } from "react-toastify";

export const useRoles = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setLoading(true);
        const data = await rolesApi.getAll();
        setRoles(data);
      } catch (err) {
        toast.error("Error al cargar roles");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoles();
  }, []);

  return { roles, loading };
};
