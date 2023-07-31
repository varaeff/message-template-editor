import React from "react";
import ReactDOM from "react-dom";
import styles from "./Modal.module.css";
import stylesBtn from "../TemplateEditor/CtrlBtns.module.css";

interface ModalProps {
  onClose: () => void;
  content: React.ReactNode;
}

const Modal: React.FC<ModalProps> = (props) => {
  return ReactDOM.createPortal(
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        {props.content}
        <button className={stylesBtn.ctrlButton} onClick={props.onClose}>
          Close
        </button>
      </div>
      <button className={styles.closeButton} onClick={props.onClose}>
        &times;
      </button>
    </div>,
    document.getElementById("modal-root")!
  );
};

export default Modal;
