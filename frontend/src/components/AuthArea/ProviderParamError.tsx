import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const ProviderParamError: React.FC = () => {
  const { search } = useLocation();
  const [paramError, setParamsError] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(search);
    const error = urlParams.get("error");
    if (!error) return;
    setParamsError(error);
  }, [search]);

  return paramError ? (
    <div className="text-center text-error">Error: {paramError}</div>
  ) : null;
};

export default ProviderParamError;
