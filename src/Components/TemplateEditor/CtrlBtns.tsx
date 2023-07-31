import styles from "./CtrlBtns.module.css";
import MessagePreview from "../MessagePreview/MsgPreview";
import React from "react";
import { Block } from "../parsers";

interface ControlButtonsProps {
  onSave: (template: any) => void;
  onClose: () => void;
  onModal: () => void;
  onSetContent: (content: React.JSX.Element) => void;
  template: Block[];
  arrVarNames: string[];
  modal: boolean;
}

function ControlButtons(props: ControlButtonsProps) {
  //СОХРАНЕНИЕ ШАБЛОНА
  function handleSave() {
    props.onSetContent(<p>The template was successfully saved</p>);
    props.onSave(props.template);
  }

  //ПРЕДПРОСМОТР СООБЩЕНИЯ
  function handlePreview(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    const actualNames = props.arrVarNames.filter(isInTemplate);

    // выборка только задействованных в шаблоне переменных
    function isInTemplate(name: string) {
      for (const item of props.template) {
        if (item.text.includes(`{${name}}`)) {
          return name;
        }
      }
      return "";
    }

    props.onSetContent(
      <MessagePreview template={props.template} arrVarNames={actualNames} />
    );
    props.onModal();
  }

  return (
    <div className={styles.cntrlButtons}>
      <button
        type="submit"
        onClick={handlePreview}
        className={styles.ctrlButton}
      >
        <svg height="14" viewBox="0 -1050 960 960" width="14" fill="#fff">
          <path d="M203.587-112.587q-37.538 0-64.269-26.731-26.731-26.731-26.731-64.269v-552.826q0-37.538 26.731-64.269 26.731-26.731 64.269-26.731h552.826q37.538 0 64.269 26.731 26.731 26.731 26.731 64.269v552.826q0 37.538-26.731 64.269-26.731 26.731-64.269 26.731H203.587ZM200-200h560v-480H200v480Zm280-80q-82 0-146.5-44.5T240-440q29-71 93.5-115.5T480-600q82 0 146.5 44.5T720-440q-29 71-93.5 115.5T480-280Zm0-100q-25 0-42.5-17.5T420-440q0-25 17.5-42.5T480-500q25 0 42.5 17.5T540-440q0 25-17.5 42.5T480-380Zm0 40q42 0 71-29t29-71q0-42-29-71t-71-29q-42 0-71 29t-29 71q0 42 29 71t71 29Z" />
        </svg>
        Preview
      </button>
      <button type="button" onClick={handleSave} className={styles.ctrlButton}>
        <svg height="14" viewBox="0 -1050 960 960" width="14" fill="#fff">
          <path d="M824.131-675.348v456.478q0 34.483-24.259 58.742t-58.742 24.259H218.87q-34.483 0-58.742-24.259t-24.259-58.742v-522.26q0-34.483 24.259-58.742t58.742-24.259h456.478l148.783 148.783Zm-83.001 34.544L640.804-741.13H218.87v522.26h522.26v-421.934ZM480-254.87q45 0 76.5-31.5t31.5-76.5q0-45-31.5-76.5t-76.5-31.5q-45 0-76.5 31.5t-31.5 76.5q0 45 31.5 76.5t76.5 31.5ZM266.87-549.13h336v-144h-336v144Zm-48-78.674v408.934-522.26 113.326Z" />
        </svg>
        Save
      </button>
      <button
        type="button"
        onClick={props.onClose}
        className={styles.ctrlButton}
      >
        <svg height="14" viewBox="0 -1050 960 960" width="14" fill="#fff">
          <path d="M341.63-288 480-426.37 618.37-288 672-341.63 533.63-480 672-618.37 618.37-672 480-533.63 341.63-672 288-618.37 426.37-480 288-341.63 341.63-288ZM480-87.87q-80.913 0-152.345-30.617-71.432-30.618-124.991-84.177-53.559-53.559-84.177-124.991Q87.869-399.087 87.869-480q0-81.913 30.618-152.845t84.177-124.491q53.559-53.559 124.991-84.177Q399.087-872.131 480-872.131q81.913 0 152.845 30.618t124.491 84.177q53.559 53.559 84.177 124.491Q872.131-561.913 872.131-480q0 80.913-30.618 152.345t-84.177 124.991q-53.559 53.559-124.491 84.177Q561.913-87.869 480-87.869Zm0-83q129.043 0 219.087-90.043Q789.13-350.957 789.13-480t-90.043-219.087Q609.043-789.13 480-789.13t-219.087 90.043Q170.87-609.043 170.87-480t90.043 219.087Q350.957-170.87 480-170.87ZM480-480Z" />
        </svg>
        Close
      </button>
    </div>
  );
}

export default ControlButtons;
