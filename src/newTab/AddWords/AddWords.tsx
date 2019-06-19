import * as React from "react";
import { PureComponent } from "react";
import "./AddWords.scss";
import { VocabWord } from "../../Utils/DbUtils";
import PasteAdd from "./PasteAdd";
import SearchAdd from "./SearchAdd";
import { SubPage } from "../components/Sidebar/Sidebar";
import InputAdd from "./InputAdd";

type Props = {
  addWord: (word: VocabWord) => any;
  subPage: SubPage;
};

enum InputMethod {
  Input = "Input",
  Search = "Search",
  Paste = "Paste"
}

function InputMethodSelector(props: {
  selectedMethod: InputMethod;
  updateMethod: (method: InputMethod) => any;
}) {
  return (
    <div className="AddWords__methods">
      {[InputMethod.Input, InputMethod.Search, InputMethod.Paste].map(
        method => {
          return (
            <div
              className={`AddWords__method ${
                method === props.selectedMethod
                  ? "AddWords__method--selected"
                  : ""
              }`}
              onClick={() => props.updateMethod(method)}
            >
              {method}
            </div>
          );
        }
      )}
    </div>
  );
}

class AddWords extends PureComponent<Props> {
  state = {
    inputMethod: InputMethod.Input
  };

  updateMethod = (inputMethod: InputMethod) => {
    this.setState({ inputMethod });
  };

  render() {
    const { inputMethod } = this.state;
    const { addWord, subPage } = this.props;

    if (subPage === SubPage.Input) {
      return  <InputAdd  addWord={addWord} />
    } else if (subPage === SubPage.Search) {
      return <SearchAdd addWord={addWord} />
    }

    return (
      <div className="AddWords">
        {subPage === SubPage.Paste && <PasteAdd addWord={addWord} />}
      </div>
    );
  }
}

export default AddWords;
