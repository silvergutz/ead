const { useLocation } = require("react-router-dom");

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default useQuery;
