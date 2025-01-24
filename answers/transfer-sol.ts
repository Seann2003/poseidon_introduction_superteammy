import {
  Pubkey,
  type SystemAccount,
  type Signer,
  SystemProgram,
  type u64,
  type Result,
} from "@solanaturbine/poseidon";

export default class TransferSol {
  static PROGRAM_ID = new Pubkey("PUT_YOUR_PROGRAM_ID_HERE");

  transferSolWithCPI(
    payer: Signer,
    recipient: SystemAccount,
    amount: u64
  ): Result {
    SystemProgram.transfer(payer, recipient, amount);
  }
}
