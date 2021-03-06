import * as React from "react";
import { PureComponent } from "react";
import "./PreviewDeck.scss";
import { getJsonFile } from "../../Utils/FetchUtils";
import PinyinConverter from "../../Utils/PinyinConverter";
import VocabCard from "../Components/VocabCard/VocabCard";
import { VocabWord } from "../../Utils/DB/VocabDb";
import { importLocalFile } from "../../Utils/Import/ImportLocalUtils";

type Props = {
  previewUrl: string;
  goBack: () => unknown;
  addWords: (words: VocabWord[]) => unknown;
};

class PreviewDeck extends PureComponent<Props> {
  state = {
    words: undefined as VocabWord[]
  };

  async componentDidMount() {
    try {
      const fileData = await fetch(this.props.previewUrl);
      const file = await fileData.blob();
      const words: VocabWord[] = await importLocalFile(file, this.props.previewUrl);

      this.setState({
        words: words.map(word => ({ ...word, reading: PinyinConverter.convert(word.reading || ""), sentences: [] }))
      });
    } catch (e) {
      alert("Could not load vocab");
      this.props.goBack();
    }
  }

  deleteWord = (word: VocabWord) => {
    const { words: oldWord } = this.state;
    const words = oldWord.filter(a => a !== word);
    this.setState({ words });
  };

  updateWord = (index: number, word: VocabWord) => {
    let words = [...this.state.words];
    words[index] = word;
    this.setState({ words });
  };

  render() {
    const { goBack, addWords } = this.props;
    const { words } = this.state;
    return (
      <div className="PreviewDeck">
        <div className="PreviewDeck__btns">
          <div className="PreviewDeck__btn PreviewDeck__btn--back" onClick={goBack}>
            Back
          </div>
          {words && (
            <div className="PreviewDeck__btn PreviewDeck__btn--add" onClick={() => addWords(words)}>
              Add Deck
            </div>
          )}
        </div>

        {!words && <div className="PreviewDeck__loading">Loading Deck...</div>}

        {words && (
          <>
            <div className="PreviewDeck__words">
              {words.map((word, i) => (
                <VocabCard
                  key={word.word + i}
                  word={word}
                  deleteWord={() => this.deleteWord(word)}
                  updateWord={word => this.updateWord(i, word)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    );
  }
}

export default PreviewDeck;
