import React, { useState } from "react";
import TemplateEditor from "./Components/TemplateEditor/TmpltEdtr";
import styles from "./App.module.css";
import { Block } from "./Components/parsers";

function App(): React.ReactNode {
  const [start, setStart] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);

  const arrVarNames: string[] = localStorage.arrVarNames
    ? JSON.parse(localStorage.arrVarNames)
    : ["firstname", "lastname", "company", "position"];

  const template: Block[] = localStorage.template
    ? JSON.parse(localStorage.template)
    : null;

  localStorage.setItem("arrVarNames", JSON.stringify(arrVarNames));

  function setStartHandler(): void {
    setStart(!start);
  }

  //СОХРАНЕНИЕ ШАБЛОНА
  async function callbackSave(template: Block[]): Promise<void> {
    localStorage.setItem("template", JSON.stringify(template));
    setShowModal(!showModal);
  }

  //УСЛОВИЕ ОТКРЫТИЯ МОДАЛЬНОГО ОКНА
  function handleModal(): void {
    setShowModal(!showModal);
  }

  return (
    <div id="modal-root">
      {!start && (
        <div className={styles.startPage}>
          <button className={styles.startButton} onClick={setStartHandler}>
            Message Editor
          </button>
        </div>
      )}
      {start && (
        <TemplateEditor
          onClose={setStartHandler}
          onSave={callbackSave}
          onModal={handleModal}
          tags={arrVarNames}
          template={template}
          modal={showModal}
        />
      )}
    </div>
  );
}

export default App;
