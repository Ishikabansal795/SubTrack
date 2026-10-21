import { useState } from "react";

export default function FormField({ id, label, type = "text", error, hint, ...props }) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <div className={"field" + (error ? " field--error" : "")}>
      <label htmlFor={id}>{label}</label>
      <div className="field__control">
        <input
          id={id}
          type={isPassword && show ? "text" : type}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          {...props}
        />
        {isPassword && (
          <button type="button" className="field__toggle" onClick={() => setShow((s) => !s)}>
            {show ? "Hide" : "Show"}
          </button>
        )}
      </div>
      {error ? (
        <p id={`${id}-error`} className="field__msg field__msg--error">
          {/* Icon + text, so colour is never the only signal */}
          <span aria-hidden="true">✕ </span>
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="field__msg">{hint}</p>
      ) : null}
    </div>
  );
}
