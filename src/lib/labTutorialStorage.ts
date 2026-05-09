const LAB_TUTORIAL_KEY = "spora_lab_tutorial_done";

export function getLabTutorialDone(): boolean {
  if (typeof localStorage === "undefined") return false;
  return localStorage.getItem(LAB_TUTORIAL_KEY) === "1";
}

export function setLabTutorialDone(): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(LAB_TUTORIAL_KEY, "1");
}
