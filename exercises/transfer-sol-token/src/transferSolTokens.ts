import {
  Pubkey,
  type Result,
} from "../../counter/node_modules/@solanaturbine/poseidon";

export default class TransferSolTokens {
  static PROGRAM_ID = new Pubkey("PUT_YOUR_PROGRAM_ID_HERE");

  // TODO: Implement SystemProgram.transfers (Remember to include the parameters from, to, amount)
  transferSolUsingCPI(): Result {}
}
