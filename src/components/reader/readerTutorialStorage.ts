const READER_TUTORIAL_KEY = "spora_reader_tutorial_done";

export function getReaderTutorialDone(): boolean {
  if (typeof localStorage === "undefined") return false;
  return localStorage.getItem(READER_TUTORIAL_KEY) === "1";
}

export function setReaderTutorialDone(): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(READER_TUTORIAL_KEY, "1");
}

