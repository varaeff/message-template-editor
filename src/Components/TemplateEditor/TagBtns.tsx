import React, { Fragment, FC } from "react";
import styles from "./TagBtns.module.css";

interface TagButtonsProps {
  addTag: (tag: string) => void;
  tags: string[];
}

const TagButtons: FC<TagButtonsProps> = ({ tags, addTag }) => {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const tag = event.currentTarget.value;
    addTag(tag);
  };

  const output = tags.map((tag, index) => (
    <button
      className={styles.tagButton}
      value={tag}
      key={index}
      onClick={handleClick}
    >
      <Fragment>
        {"{"}
        {tag}
        {"}"}
      </Fragment>
    </button>
  ));

  return <div className={styles.tagButtons}>{output}</div>;
};

export default TagButtons;
