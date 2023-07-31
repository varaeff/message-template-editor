import React, { useRef, useEffect } from "react";
import styles from "./TextArea.module.css";

interface TextAreaProps {
  stateChange: (index: number, cursorPosition: number, newText: string) => void;
  delBlock: (index: number) => void;
  index: number;
  width: string;
  type: string;
  text: string;
  readOnly: boolean;
}

function TextArea(props: TextAreaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // первичная настройка отображения компонента
  useEffect(() => {
    const textarea = textareaRef.current;

    if (props.type === "TEXT") {
      if (textarea) textarea.style.width = "100%";
    }
    adjustTextareaHeight(textarea);
  });

  // ПЕРЕДАЧА ИНДЕКСА БЛОКА ТЕКСТА, ПОЛОЖЕНИЯ КУРСОРА И НОВОГО ТЕКСТА В TemplateEditor
  //при изменении данных в textarea
  function handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    if (!props.readOnly) {
      const newText = event.target.value;
      const textarea = textareaRef.current;
      const cursorPosition = textarea?.selectionStart ?? 0;

      props.stateChange(props.index, cursorPosition, newText);
      adjustTextareaHeight(textarea);
    }
  }

  // ПЕРЕДАЧА ИНДЕКСА БЛОКА ТЕКСТА, ПОЛОЖЕНИЯ КУРСОРА И НОВОГО ТЕКСТА В TemplateEditor
  //при изменении положения курсора с клавиатуры
  function handleKeyUp(event: React.KeyboardEvent) {
    const changeEvent =
      event as unknown as React.ChangeEvent<HTMLTextAreaElement>;
    handleChange(changeEvent);
  }

  // ПЕРЕДАЧА ИНДЕКСА БЛОКА ТЕКСТА, ПОЛОЖЕНИЯ КУРСОРА И НОВОГО ТЕКСТА В TemplateEditor
  //при изменении положения курсора кликом мыши
  function handleMouseUp(event: React.MouseEvent) {
    const changeEvent =
      event as unknown as React.ChangeEvent<HTMLTextAreaElement>;
    handleChange(changeEvent);
  }

  // КОРРЕКТИРОВКА ВЫСОТЫ БЛОКА В ЗАВИСИМОСТИ ОТ СОДЕРЖИМОГО
  function adjustTextareaHeight(textarea: HTMLTextAreaElement | null) {
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  }

  // ПЕРЕДАЧА ИНДЕКСА УДАЛЯЕМОГО КОМПОНЕНТА В TemplateEditor
  function delBtnClick() {
    props.delBlock(props.index);
  }

  return (
    <div style={{ width: props.width }}>
      <div className={styles.block}>
        {props.type !== "TEXT" && (
          <div className={styles.statement}>{props.type}</div>
        )}
        {props.type === "IF" && (
          <button className={styles.delbtn} type="button" onClick={delBtnClick}>
            <svg height="14" viewBox="0 -960 960 960" width="14">
              <path d="M340-164q-33.7 0-55.85-22.15T262-242v-458h-48v-46h168v-44h198v44h168v46h-48v457.566q0 34.159-22.287 56.297Q655.425-164 622-164H340Zm314-536H308v458q0 14 9 23t23 9h282q12 0 22-10t10-22v-458ZM405-283h46v-344h-46v344Zm106 0h46v-344h-46v344ZM308-700v490-490Z" />
            </svg>
            Delete
          </button>
        )}
        <textarea
          onChange={handleChange}
          onKeyUp={handleKeyUp}
          onMouseUp={handleMouseUp}
          readOnly={props.readOnly}
          ref={textareaRef}
          value={props.text}
          className={`${styles.textarea} ${
            props.type === "IF" ? styles.background : ""
          }`}
        />
      </div>
    </div>
  );
}

export default TextArea;
