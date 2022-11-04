import ReactDOM from "react-dom";

const Backdrop = () => {
  return ReactDOM.createPortal(
    <div className="fixed top-0 left-0 right-0 bottom-0 z-10 bg-main-bg dark:bg-main-dark-bg opacity-95"></div>,
    document.getElementById("backdrop-hook")!
  );
};

export default Backdrop;
