import { failureViewUri } from "./Illustrations";

interface Props {
  onRetry: () => void;
}

const FailureView = ({ onRetry }: Props) => (
  <div className="failure">
    <img src={failureViewUri} alt="failure view" className="failure-img" />
    <p className="failure-text">Something went wrong. Please try again</p>
    <button type="button" onClick={onRetry} className="failure-btn">
      Try Again
    </button>
  </div>
);

export default FailureView;
