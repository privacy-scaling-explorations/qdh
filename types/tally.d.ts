export interface TallyResult {
  provider: string
  maci: string
  results: {
    commitment: string
    tally: Array<string>
    salt: string
  }
  totalVoiceCredits: {
    spent: string
    commitment: string
    salt: string
  }
  totalVoiceCreditsPerVoteOption: {
    commitment: string
    tally: Array<string>
    salt: string
  }
}
