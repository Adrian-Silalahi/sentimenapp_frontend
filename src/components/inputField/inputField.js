import EyeIcon from "../atomComponents/eyeIcon";

const InputField = ({
  id,
  name,
  label,
  type,
  value,
  onChange,
  onBlur,
  error,
  required = false,
  autoComplete,
  isPassword = false,
  showPassword,
  onToggleShowPassword,
}) => {
  const inputType = isPassword && showPassword ? "text" : type;
  const errorId = `${id}-error`;

  return (
    <div className="input-group">
      <label htmlFor={id}>{label}</label>
      {isPassword ? (
        <div className="password-input-wrapper">
          <input
            type={inputType}
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            required={required}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
            autoComplete={autoComplete || "new-password"}
          />
          <button
            type="button"
            onClick={onToggleShowPassword}
            className="password-toggle-button"
            aria-label={
              showPassword
                ? `Hide ${label.toLowerCase()}`
                : `Show ${label.toLowerCase()}`
            }
          >
            <EyeIcon slash={showPassword} />
          </button>
        </div>
      ) : (
        <input
          type={type}
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          required={required}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          autoComplete={autoComplete || "off"}
        />
      )}
      {error && (
        <p id={errorId} className="error-message">
          {error}
        </p>
      )}
    </div>
  );
};

export default InputField;
