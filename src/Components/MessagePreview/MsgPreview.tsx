import TextArea from "../TemplateEditor/TextArea";
import Variables from "./Variables";
import styles from "./MsgPreview.module.css";
import React, { useState } from "react";
import { generateMessage, Block } from "../parsers";

interface MessagePreviewProps {
  arrVarNames: string[];
  template: Block[];
}

//ФУНКЦИЯ ПРЕДПРОСМОТРА СООБЩЕНИЯ
function MessagePreview(props: MessagePreviewProps) {
  const names = props.arrVarNames.reduce((acc, key) => {
    acc[key] = "";
    return acc;
  }, {} as { [key: string]: string });

  const [values, setLetterNames] = useState<{ [key: string]: string }>(names);

  function handleNameChange(tag: string, name: string) {
    setLetterNames((prevNames) => ({ ...prevNames, [tag]: name }));
  }

  return (
    <div>
      <div className={styles.label}>
        <h2>Message Preview</h2>
      </div>
      <TextArea
        type="TEXT"
        readOnly={true}
        text={generateMessage(
          JSON.parse(JSON.stringify(props.template)),
          values
        )}
        index={0}
        width={""}
        stateChange={function (
          index: number,
          cursorPosition: number,
          newText: string
        ): void {}}
        delBlock={function (index: number): void {}}
      />
      <Variables tags={props.arrVarNames} nameChange={handleNameChange} />
    </div>
  );
}

export default MessagePreview;
