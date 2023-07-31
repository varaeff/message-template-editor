import styles from "./Variable.module.css";
import React, { useState, ChangeEvent } from "react";

interface VariableProps {
  tag: string;
  nameChange: (tag: string, name: string) => void;
}

//КОМПОНЕНТ ВВОДА ПЕРЕМЕННОЙ
function Variable(props: VariableProps) {
  const [isFocused, setFocused] = useState(false);
  const [newName, setName] = useState("");

  function handleFocus() {
    setFocused(true);
  }

  function handleBlur() {
    setFocused(false);
  }

  //ПЕРЕДАЧА ЗНАЧЕНИЯ В ШАБЛОН
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const newName = event.target.value;
    setName(newName);
    props.nameChange(props.tag, newName);
  }

  return (
    <label className={styles.placeinput}>
      {isFocused || newName.length ? (
        <div>
          <input
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            className={styles.input}
            type="text"
          />
          <span className={`${styles.placeholder} ${styles.placeholder_edit}`}>
            {props.tag}
          </span>
        </div>
      ) : (
        <div>
          <input
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            className={styles.input}
            type="text"
          />
          <span className={styles.placeholder}>{props.tag}</span>
        </div>
      )}
    </label>
  );
}

export default Variable;
