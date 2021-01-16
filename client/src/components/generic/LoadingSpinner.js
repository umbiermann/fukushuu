import { Spinner } from "reactstrap";

const LoadingSpinner = () => {
  return (
    <div className="d-flex justify-content-center align-items-center mt-5 mw-100">
      <Spinner color="dark" />
    </div>
  );
};

export default LoadingSpinner;
