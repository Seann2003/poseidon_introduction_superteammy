import {
  type Account,
  Pubkey,
  type Result,
  u64,
  type u8,
  type Signer,
} from "@solanaturbine/poseidon";

export default class CounterProgram {
  // The program ID for the CounterProgram
  static PROGRAM_ID = new Pubkey("PUT_YOUR_PROGRAM_ID_HERE");

  // Method to initialize the counter state
  initialize(state: CounterState, user: Signer): Result {
    state.derive(["count"]).init(user); // Derive and initialize the count field
    // TODO: Set the initial count to 0
    state.count = new u64(0);
  }

  // Method to increment the counter state
  increment(state: CounterState): Result {
    state.derive(["count"]); // Derive the count field
    // TODO: Increment the count value by one
    state.count = state.count.add(1);
  }

  // Method to increment the counter state
  decrement(state: CounterState): Result {
    state.derive(["count"]); // Derive the count field
    // TODO: Decrement the count value by one
    state.count = state.count.sub(1);
  }
}

// Interface representing the state of the counter
export interface CounterState extends Account {
  count: u64; // The current count value
  bump: u8; // A bump value for account derivation
}
