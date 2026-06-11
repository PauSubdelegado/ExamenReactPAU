import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useAuth } from '../auth/AuthContext.jsx';

const API_URL = import.meta.env.VITE_API_URL;
const NOTES_URL = `${API_URL}notes`;

const COLORS = [
  { cls: "note-yellow", hex: "#FFF9C4" },
  { cls: "note-pink",   hex: "#F8BBD0" },
  { cls: "note-blue",   hex: "#BBDEFB" },
  { cls: "note-green",  hex: "#C8E6C9" },
  { cls: "note-orange", hex: "#FFE0B2" },
];

const NoteSchema = Yup.object({
  text: Yup.string()
    .min(10, "Mínimo 10 caracteres")
    .max(200, "Máximo 200 caracteres")
    .required("El texto es obligatorio"),
    color: Yup.string()
    .required("El color es obligatorio"),
});

const AltaModal = ({ modalOpen, closeModal }) => {
  const { token } = useAuth();

  if (!modalOpen) return null;

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ background: "rgba(0,0,0,0.45)", zIndex: 10 }}
      onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
    >
      <div
        className="bg-white rounded-3 p-4"
        style={{ width: 300, border: "0.5px solid rgba(0,0,0,0.12)" }}
        role="dialog"
        aria-modal="true"
      >
        <p className="fw-bold mb-3" style={{ fontSize: 14, color: "#111" }}>
          Nueva nota
        </p>

        <Formik
          initialValues={{ text: "", color: "note-yellow" }}
          validationSchema={NoteSchema}
          onSubmit={async (values, { resetForm }) => {
            try {
              await axios.post(
                NOTES_URL,
                { ...values, done: false },
                { headers: { Authorization: `Bearer ${token}` } }
              );
              resetForm();
              closeModal();
            } catch (err) {
              alert("Error guardando la nota: " + err.message);
            }
          }}
        >
          {({ values, setFieldValue }) => (
            <Form>
              {/* Texto */}
              <div className="mb-3">
                <Field
                  as="textarea"
                  name="text"
                  className="form-control"
                  style={{
                    height: 90, fontSize: 13, resize: "none",
                    background: "#f5f5f5", color: "#111",
                    border: "0.5px solid rgba(0,0,0,0.2)",
                  }}
                  placeholder="Escribe tu nota aquí..."
                  maxLength={200}
                  autoFocus
                />
                <ErrorMessage name="text" component="div" className="text-danger small mt-1" />
              </div>

              <div className="d-flex gap-2 mb-3">
                {COLORS.map((c) => (
                  <div
                    key={c.cls}
                    onClick={() => setFieldValue("color", c.cls)}
                    role="radio"
                    aria-checked={values.color === c.cls}
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && setFieldValue("color", c.cls)}
                    style={{
                      width: 24, height: 24,
                      borderRadius: "50%",
                      background: c.hex,
                      cursor: "pointer",
                      border: values.color === c.cls
                        ? "3px solid #333"
                        : "2px solid #ccc",
                    }}
                    title={c.cls}
                  />
                ))}
              </div>

              <ErrorMessage name="color" component="div" className="text-danger small mb-2" />

              <div className="d-flex gap-2 justify-content-end">
                <button
                  type="button"
                  className="border rounded-2 px-3 py-1 bg-white"
                  style={{ fontSize: 13, cursor: "pointer" }}
                  onClick={closeModal}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="border-0 rounded-2 px-3 py-1"
                  style={{
                    fontSize: 13, fontWeight: 500, cursor: "pointer",
                    background: "#F5E6C8", color: "#3B1F07"
                  }}
                >
                  Guardar
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AltaModal;