import * as React from "react";
import { PureComponent } from "react";
import "./LearnPage.scss";
import { speak } from "../../Utils/SpeechUtils";
import { VocabWord } from "../../Utils/DB/VocabDb";
import { getUserPreferences, Language } from "../../Utils/UserPreferencesUtils";
import { Page, SubPage } from "../Pages";
import ColoredReading from "./ColoredReading";

type Props = {
  vocab: VocabWord;
  deleteWord: (word: VocabWord) => unknown;
  selectPage: (page: Page, subPage: SubPage) => unknown;
};

class LearnPage extends PureComponent<Props> {
  deleteWord = () => {
    const confirmed = confirm("Are you sure you want to delete this word?");
    if (confirmed) {
      this.props.deleteWord(this.props.vocab);
    }
  };

  render() {
    const { showChinesePodLink, language } = getUserPreferences();
    const isChinese = language === Language.Chinese;
    const { vocab } = this.props;

    return (
      <div className={`LearnPage ${showChinesePodLink || !isChinese ? "LearnPage--deleteBottom" : ""}`}>
        <div className="LearnPage__inner" style={{ zIndex: 10 }}>
          <div className="LearnPage__reading">
            <ColoredReading reading={vocab.reading} />
          </div>

          <div className="LearnPage__word" onClick={() => speak(vocab.word, vocab.audio)}>
            {vocab.word}
          </div>

          <div
            className={`LearnPage__meaning ${
              vocab.meaning && vocab.meaning.length > 40 ? "LearnPage__meaning--long" : ""
            }`}
          >
            {vocab.meaning}
          </div>

          {vocab.sentences &&
            vocab.sentences.map((sentence, i) => (
              <div className="LearnPage__sentenceWrapper" key={i}>
                <div className="LearnPage__sentence" onClick={() => speak(sentence.sentence)}>
                  {sentence.sentence}
                </div>

                <div className="LearnPage__sentencePinyin">{sentence.reading}</div>
              </div>
            ))}

          {isChinese && showChinesePodLink && (
            <a
              className="LearnPage__btn LearnPage__btn--chinesePod"
              target="_blank"
              href={`https://chinesepod.com/dictionary/english-chinese/${vocab.word && vocab.word.split(" ")[0]}`}
            >
              Open in Chinesepod
            </a>
          )}

          {!isChinese && (
            <a
              className="LearnPage__btn LearnPage__btn--jisho"
              target="_blank"
              href={`https://jisho.org/search/${vocab.word && vocab.word.split(" ")[0]}`}
            >
              Open in jisho
            </a>
          )}

          {showChinesePodLink && (
            <div className="LearnPage__btn LearnPage__btn--delete" onClick={this.deleteWord}>
              Delete word
            </div>
          )}

          <div
            className="LearnPage__btn LearnPage__btn--test"
            onClick={() => this.props.selectPage(Page.Test, SubPage.TestWords)}
          >
            Test
          </div>
        </div>

        {vocab.imageUrl && (
          <>
            <img className="LearnPage__image" src={vocab.imageUrl} />
            {vocab.imageAuthor && (
              <div className="LearnPage__imageAuthor">
                Image by{" "}
                <a target="_blank" href={vocab.imageAuthor.link}>
                  {vocab.imageAuthor.name}
                </a>
              </div>
            )}
          </>
        )}
      </div>
    );
  }
}

export default LearnPage;
