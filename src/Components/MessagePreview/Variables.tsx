import React from "react";
import Variable from "./Variable";
import styles from "./Variables.module.css";

interface VariablesProps {
  tags: string[];
  nameChange: (tag: string, name: string) => void;
}

//КОМПОНЕНТ ВЫВОДА СПИСКА ЗАДЕЙСТВОВАННЫХ ПЕРЕМЕННЫХ
function Variables(props: VariablesProps) {
  const output = props.tags.map((tag) => (
    <Variable tag={tag} key={tag} nameChange={props.nameChange} />
  ));

  return (
    <div className={styles.container}>
      {props.tags.length > 0 && <h3>Variables:</h3>}
      {output}
    </div>
  );
}

export default Variables;
