const EyeIcon = ({ slash }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="eye-icon"
  >
    {slash ? (
      <>
        <path
          d="M2 2L22 22"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10.5838 10.587C10.2111 11.0139 10 11.5005 10 12C10 13.1046 10.8954 14 12 14C12.4995 14 12.9861 13.7889 13.413 13.4162M13.413 13.4162C13.8332 13.0478 14.2965 12.7295 14.7811 12.4697C16.4341 11.5226 17.5 10.189 17.5 9.5C17.5 7.01472 15.0376 5 12 5C10.1834 5 8.55386 5.95977 7.27006 7.24738"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M20.9417 11.0022C20.4033 12.3054 19.6343 13.4936 18.68 14.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6.5 14.5C4.99121 13.547 3.75695 12.2109 3.05833 11.0022C2.5 9.5 2.5 7.5 4.5 5.5C4.99049 5.01039 5.52126 4.56353 6.08254 4.16414"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>
    ) : (
      <>
        <path
          d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx="12"
          cy="12"
          r="3"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>
    )}
  </svg>
);

export default EyeIcon;
