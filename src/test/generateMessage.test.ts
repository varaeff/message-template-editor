import { generateMessage, Block } from "../Components/parsers";

const arrVarNames: string[] = localStorage.arrVarNames
  ? JSON.parse(localStorage.arrVarNames)
  : ["firstname", "lastname", "company", "position"];

localStorage.setItem("arrVarNames", JSON.stringify(arrVarNames));

describe("generateMessage function", () => {
  it("сообщение сформировано по шаблону из одного блока", () => {
    const template: Block[] = [
      {
        text: "Hello, {firstname1}!",
        type: "TEXT",
        index: 0,
        width: 100,
      },
    ];
    const values: Record<string, string> = { firstname: "Somename" };
    expect(generateMessage(template, values, "1", true)).toBe(
      "Hello, Somename!"
    );
  });

  it("сообщение сформировано по шаблону из одного блока, есть лишние значения", () => {
    const template: Block[] = [
      {
        text: "Hello, {firstname1}!",
        type: "TEXT",
        index: 0,
        width: 100,
      },
    ];
    const values: Record<string, string> = {
      firstname: "Somename",
      middlename: "err",
    };
    expect(generateMessage(template, values, "1", true)).toBe(
      "Hello, Somename!"
    );
  });

  it("сообщение сформировано по шаблону из одного блока, пропущены значения", () => {
    const template: Block[] = [
      {
        text: "Hello, {firstname1}!",
        type: "TEXT",
        index: 0,
        width: 100,
      },
    ];
    const values: Record<string, string> = {};
    expect(generateMessage(template, values, "1", true)).toBe("Hello, !");
  });

  it("Возврат сообщения для случая с одним блоком if-then-else, if==true", () => {
    const template: Block[] = [
      { index: 0, text: "{firstname1}", type: "TEXT", width: 100 },
      { index: 1, type: "IF", text: "{company1}", width: 100 },
      { index: 2, type: "THEN", text: "{position1}", width: 100 },
      { index: 3, type: "ELSE", text: "pass", width: 100 },
      { index: 4, type: "TEXT", text: "end", width: 100 },
    ];
    const values: Record<string, string> = {
      firstname: "Somename",
      company: "Somecompany",
      position: "Someposition",
    };
    expect(generateMessage(template, values, "1", true)).toBe(
      "SomenameSomepositionend"
    );
  });

  it("Возврат сообщения для случая с одним блоком if-then-else, if==false", () => {
    const template: Block[] = [
      { index: 0, text: "{firstname1}", type: "TEXT", width: 100 },
      { index: 1, type: "IF", text: "{company1}", width: 100 },
      { index: 2, type: "THEN", text: "{position1}", width: 100 },
      { index: 3, type: "ELSE", text: "pass", width: 100 },
      { index: 4, type: "TEXT", text: "end", width: 100 },
    ];
    const values: Record<string, string> = {
      firstname: "Somename",
      company: "",
      position: "Someposition",
    };
    expect(generateMessage(template, values, "1", true)).toBe(
      "Somenamepassend"
    );
  });

  it("Возврат сообщения для случая с двумя блоком if-then-else, if==true-true", () => {
    const template: Block[] = [
      { index: 0, text: "start", type: "TEXT", width: 100 },
      { index: 1, type: "IF", text: "{company1}", width: 100 },
      { index: 2, type: "THEN", text: "then", width: 100 },
      { index: 3, type: "IF", text: "{position1}", width: 90 },
      { index: 4, type: "THEN", text: "inner-then", width: 90 },
      { index: 5, type: "ELSE", text: "inner-else", width: 90 },
      { index: 6, type: "TEXT", text: "end-if-inner", width: 90 },
      { index: 7, type: "ELSE", text: "else", width: 100 },
      { index: 8, type: "TEXT", text: "end-if", width: 100 },
    ];
    const values: Record<string, string> = {
      firstname: "testname",
      company: "1",
      position: "1",
    };
    expect(generateMessage(template, values, "1", true)).toBe(
      "starttheninner-thenend-if-innerend-if"
    );
  });

  it("Возврат сообщения для случая с двумя блоком if-then-else, if==false-true", () => {
    const template: Block[] = [
      { index: 0, text: "start", type: "TEXT", width: 100 },
      { index: 1, type: "IF", text: "{company1}", width: 100 },
      { index: 2, type: "THEN", text: "then", width: 100 },
      { index: 3, type: "IF", text: "{position1}", width: 90 },
      { index: 4, type: "THEN", text: "inner-then", width: 90 },
      { index: 5, type: "ELSE", text: "inner-else", width: 90 },
      { index: 6, type: "TEXT", text: "end-if-inner", width: 90 },
      { index: 7, type: "ELSE", text: "else", width: 100 },
      { index: 8, type: "TEXT", text: "end-if", width: 100 },
    ];
    const values: Record<string, string> = {
      firstname: "testname",
      company: "",
      position: "1",
    };
    expect(generateMessage(template, values, "1", true)).toBe(
      "startelseend-if"
    );
  });

  it("Возврат ошибки при получении пустого шаблона", () => {
    const template: Block[] = [];
    const values: Record<string, string> = {};
    expect(generateMessage(template, values, "", true)).toBe(
      "An error occurred while getting the template!"
    );
  });
});
