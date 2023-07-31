import styles from "./TmpltEdtr.module.css";
import React, { Fragment, useState } from "react";
import TextArea from "./TextArea";
import TagButtons from "./TagBtns";
import ControlButtons from "./CtrlBtns";
import { getSeparator, addBlocks, Block } from "../parsers";
import Modal from "../Modal/Modal";

interface TemplateEditorProps {
  onClose: () => void;
  onSave: (template: Block[]) => Promise<void>;
  onModal: () => void;
  tags: string[];
  template: Block[];
  modal: boolean;
}

// ВИДЖЕТ РЕДАКТИРОВАНИЯ ШАБЛОНА СООБЩЕНИЙ
function TemplateEditor(props: TemplateEditorProps) {
  const arrVarNames = props.tags;
  const [content, setContent] = useState<React.ReactNode>("");

  //шаблон сообщения
  const template: Block[] = props.template
    ? JSON.parse(localStorage.template)
    : [{ index: 0, text: "", type: "TEXT", width: 100, sep: "" }];

  const [textAreaInd, setTextAreaInd] = useState<number>(0); //индекс блока ввода
  const [cursorPos, setCursorPos] = useState<number>(0); //позиция курсора в блоке
  let [textBlocks, setTextBlocks] = useState<Block[]>(template); //обновление шаблона

  // КОМПОНЕНТ БЛОКА ТЕКСТА
  const output = textBlocks.map((block) => (
    <TextArea
      key={block.index}
      index={block.index}
      stateChange={handleStateChange}
      text={block.text}
      type={block.type}
      delBlock={handleDelTextarea}
      width={block.width + "%"}
      readOnly={false}
    />
  ));

  // ОБНОВЛЕНИЕ СОСТОЯНИЯ ПРИ ИЗМЕНЕНИИ ИНФОРМАЦИИ В ПОЛЯХ
  function handleStateChange(newInd: number, newPos: number, newText: string) {
    // индекс текущего поля ввода
    setTextAreaInd(newInd);
    // текущее положение курсора
    setCursorPos(newPos);
    // обновление информации в шаблоне
    setTextBlocks((prevTextBlocks) =>
      prevTextBlocks.map((block) =>
        block.index === newInd ? { ...block, text: newText } : block
      )
    );
  }

  // УДАЛЕНИЕ БЛОКА IF-THEN-ELSE
  function handleDelTextarea(delIndex: number) {
    let deep = 1;
    let endIndex = delIndex;
    let type = "IF";

    // находим конец удаляемого блока
    while (deep !== 0 || type !== "TEXT") {
      endIndex += 1;
      type = textBlocks[endIndex].type;
      if (type === "IF") {
        deep += 1;
      }
      if (type === "TEXT" && deep > 0) deep -= 1;
    }

    // объединяем текст из полей перед и после блока
    const newText = textBlocks[delIndex - 1].text.concat(
      textBlocks[endIndex].sep,
      textBlocks[endIndex].text
    );
    textBlocks[delIndex - 1].text = newText;

    // удаляем блок
    textBlocks.splice(delIndex, endIndex - delIndex + 1);

    // переиндексируем блоки и обновляем вывод
    textBlocks.forEach((block, index) => (block.index = index));
    handleStateChange(delIndex - 1, 0, newText);
  }

  // ДОБАВЛЕНИЕ БЛОКА IF-THEN-ELSE
  function handleAddTextarea() {
    if (textBlocks[textAreaInd].width >= 40) {
      // делим текст исходного блока по положению курсора
      const currentText = textBlocks[textAreaInd].text;
      let newText1 = currentText.slice(0, cursorPos);
      let newText2 = currentText.slice(cursorPos);

      // проверка на пробел или перенос строки при разбивке
      const separator = getSeparator(newText1, newText2);

      newText1 = newText1.trim();
      newText2 = newText2.trim();
      let blockWidth = textBlocks[textAreaInd].width;
      if (textBlocks[textAreaInd].type !== "TEXT") blockWidth -= 10;

      // добавляем новые блоки в массив
      textBlocks = addBlocks(textBlocks, textAreaInd, blockWidth, separator);

      // переиндексируем блоки и обновляем вывод
      textBlocks.forEach((block, index) => (block.index = index));
      handleStateChange(textAreaInd + 4, 0, newText2);
      handleStateChange(textAreaInd, 0, newText1);
    } else {
      setContent(<p>Maximum nesting depth of elements - 7</p>);
      props.onModal();
    }
  }

  // ДОБАВЛЕНИЕ ПЕРЕМЕННЫХ В БЛОКИ ПРИ КЛИКЕ НА КНОПКУ
  function handleTagButtonClick(tag: string) {
    const tagText = "{" + tag + "}";
    const currentText = textBlocks[textAreaInd].text;
    const newText = currentText
      .slice(0, cursorPos)
      .concat(tagText, currentText.slice(cursorPos))
      .trim();

    handleStateChange(textAreaInd, cursorPos, newText);
  }

  // console.log(textBlocks);
  return (
    <div className={styles.editor}>
      <div className={styles.label}>
        <h2>Message Template Editor</h2>
      </div>
      <TagButtons tags={arrVarNames} addTag={handleTagButtonClick} />
      <button onClick={handleAddTextarea} className={styles.ifButton}>
        <Fragment>
          <b>Click to add</b> : <b className={styles.statement}>IF</b> [{"{"}
          some_variable{"}"} or expression]{" "}
          <b className={styles.statement}>THEN</b> [then_value]{" "}
          <b className={styles.statement}>ELSE</b> [else_value]
        </Fragment>
      </button>
      <form className={styles.form} id="mainform">
        {output}
        <ControlButtons
          onClose={props.onClose}
          onSave={props.onSave}
          onModal={props.onModal}
          onSetContent={setContent}
          template={textBlocks}
          arrVarNames={arrVarNames}
          modal={props.modal}
        />
      </form>
      {props.modal && <Modal onClose={props.onModal} content={content} />}
    </div>
  );
}

export default TemplateEditor;
