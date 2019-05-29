import { VocabWord } from "./AddWords";

export async function getVocabWords(): Promise<VocabWord[]> {
  return new Promise<VocabWord[]>(resolve => {
    chrome.storage.sync.get(["words"], result => resolve(result.words));
  });
}

export async function setVocabWords(words: VocabWord[]) {
  return new Promise(resolve => {
    chrome.storage.sync.set({ words: words }, resolve);
  });
}