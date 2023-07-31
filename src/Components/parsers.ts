interface Block {
  index: number;
  type: string;
  text: string;
  width: number;
  sep: string;
}

//ОПРЕДЕЛЕНИЕ РАЗДЕЛИТЕЛЯ ПРИ РАЗРЫВЕ ТЕКСТОВОГО БЛОКА
function getSeparator(str1: string, str2: string): string {
  const separator1 = getSepEnd(str1, 0);
  if (separator1 === "\n") return "\n";

  const separator2 = getSepStart(str2, 0);
  if (separator2 === "\n") return "\n";

  if (separator1 === " " || separator1 === " ") return " ";
  return "";

  function getSepEnd(str: string, sep: number): string {
    if (str.endsWith(" ")) {
      return getSepEnd(str.slice(0, -1), 1);
    } else if (str.endsWith("\n") && !str.endsWith("\\n")) {
      return "\n";
    } else if (sep) {
      return " ";
    } else return "";
  }

  function getSepStart(str: string, sep: number): string {
    if (str.startsWith(" ")) {
      return getSepStart(str.slice(1), 1);
    } else if (str.startsWith("\n")) {
      return "\n";
    } else if (sep) {
      return " ";
    } else return "";
  }
}

//ДОБАВЛЕНИЕ БЛОКОВ IF-THEN-ELSE В ШАБЛОН СООБЩЕНИЯ
function addBlocks(
  textBlocks: Block[],
  textAreaInd: number,
  blockWidth: number,
  separator: string
): Block[] {
  const nextInd =
    textBlocks.reduce((maxIndex, block) => {
      return Math.max(maxIndex, block.index);
    }, -1) + 1;
  textBlocks.splice(
    textAreaInd + 1,
    0,
    {
      index: nextInd,
      type: "IF",
      text: "",
      width: blockWidth,
      sep: "",
    },
    {
      index: nextInd + 1,
      type: "THEN",
      text: "",
      width: blockWidth,
      sep: "",
    },
    {
      index: nextInd + 2,
      type: "ELSE",
      text: "",
      width: blockWidth,
      sep: "",
    },
    {
      index: nextInd + 3,
      type: "TEXT",
      text: "",
      width: blockWidth,
      sep: separator,
    }
  );
  return textBlocks;
}

//ФУНКЦИЯ ГЕНЕРАЦИИ СООБЩЕНИЯ
function generateMessage(
  template: Block[] = [],
  values: Record<string, string>
): string {
  const storedVarNames = localStorage.getItem("arrVarNames");
  const storage = storedVarNames ? JSON.parse(storedVarNames) : [];
  values = normilizeValues(values, storage);

  //возврат ошибки при получении пустого шаблона
  if (template.length === 0)
    return "An error occurred while getting the template!";

  // возврат сгенерированного сообщения
  if (template.length === 1) return setValues(template[0].text, values);

  const deepInd = deepestIf(template);
  const flatTemplate = JSON.parse(JSON.stringify(template)).slice(
    deepInd - 1,
    deepInd + 4
  );
  // перенос вычисленного if в блок перед условием
  template[deepInd - 1].text = flatIf(flatTemplate);

  // убираем самый глубокий блок условия из схемы
  template.splice(deepInd, 4);
  // переиндексируем схему
  template.forEach((block, index) => (block.index = index));

  // рекурсия
  return generateMessage(JSON.parse(JSON.stringify(template)), values);

  // поиск группы if-then-else без вложений
  function deepestIf(templateDeep: Block[]): number {
    const ifEls = templateDeep.filter((item) => item.type === "IF");

    const deepIndex = ifEls.reduce((min, item, current) => {
      return item.width < ifEls[min].width ? current : min;
    }, 0);

    return ifEls[deepIndex].index;
  }

  // вывод if-then-else для ситуации без вложений
  function flatIf(tmplt: Block[]): string {
    const ifTrigger = setValues(tmplt[1].text, values).trim().length > 0;
    const next = ifTrigger ? 2 : 3;

    return setValues(tmplt[0].text, values).concat(
      " ",
      setValues(tmplt[next].text, values),
      " ",
      setValues(tmplt[4].text, values)
    );
  }

  // подстановка значений переменных в ячейках
  function setValues(str: string, values: Record<string, string>): string {
    const regex = /\{([^{}]+)\}/g;
    return str.replace(regex, (match, key) => {
      return values.hasOwnProperty(key) ? values[key] : match;
    });
  }

  // сравнение полученных ключей с данными из хранилища
  function normilizeValues(
    values: Record<string, string>,
    arrVarNames: string[]
  ): Record<string, string> {
    const updatedValues: Record<string, string> = { ...values };

    // Добавляем отсутствующие ключи из arrVarNames в объект updatedValues со значением ""
    for (const key of arrVarNames) {
      if (!updatedValues.hasOwnProperty(key)) {
        updatedValues[key] = "";
      }
    }

    // удаление ключей из объекта updatedValues, которых нет в arrVarNames
    for (const key in updatedValues) {
      if (!arrVarNames.includes(key)) {
        delete updatedValues[key];
      }
    }

    return updatedValues;
  }
}

export { getSeparator, addBlocks, generateMessage, Block };
