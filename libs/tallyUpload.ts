import { TallyResult } from '../types/tally'

declare type Callback = (myArgument: TallyResult) => void

export function tallyUpload(callback: Callback) {
  const inputEl = document.createElement('input')
  inputEl.setAttribute('type', 'file')
  inputEl.setAttribute('accept', 'application/json')
  inputEl.onchange = () => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const tallyResult: TallyResult = JSON.parse(String(reader.result)) as TallyResult
        if(!tallyResult.maci || !tallyResult.totalVoiceCredits) {
          throw new Error(`Doesn't look like tally.json format`);
        }
        callback(tallyResult)
        document.dispatchEvent(new Event('mousedown')) // closes the dropdown
      } catch (err) {
        alert(`Something's wrong with your tally.json. Try again.`)
      }
    }
    if (inputEl.files) {
      reader.readAsText(inputEl.files[0])
    }
  }
  inputEl.click()
}
