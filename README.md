Make sure you have Rust, Anchor, Yarn and Cargo installed

https://gist.github.com/emersonliuuu/81f1ce90bbaeef8bdb22b6e65f56b3b7

```$ rustup --version```
rustup 1.27.1 (54dd3d00f 2024-04-24)
```$ solana --version``
solana-cli 1.18.17 (src:b685182a; feat:4215500110, client:SolanaLabs)
```$ yarn --version```
1.22.19
```$ anchor --version```
anchor-cli 0.30.1


Installing with Cargo
```cargo install --git  https://github.com/Turbin3/poseidon```
That's it, you're done!


After writing your Typescript code in ts-programs/src
``` poseidon build ```

If the rust code has been generated then
``` anchor build ```


expenses-tracker.ts (test script)

```
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { ExpensesTracker } from "../target/types/expenses_tracker";
import { assert } from "chai";

describe("expenses_tracker", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.ExpensesTracker as Program<ExpensesTracker>;
  const wallet = provider.wallet;

  const [expenseAccountPda] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("expenses"), wallet.publicKey.toBuffer()],
    program.programId // The program ID
  );

  it("can initialize an expense account", async () => {
    // Initialize expense account
    await program.methods
      .initExpense()
      .accounts({
        owner: wallet.publicKey,
      })
      .rpc();

    const expenseAccount = await program.account.expenseAccount.fetch(
      expenseAccountPda
    );

    assert.equal(expenseAccount.owner.toBase58(), wallet.publicKey.toBase58());
    assert.equal(expenseAccount.balance.toNumber(), 0);
  });

  it("can clear expenses", async () => {
    const transactionNote = "Clear expenses";
    // Clear expenses
    await program.methods
      .clearExpenses(transactionNote)
      .accounts({
        owner: wallet.publicKey,
      })
      .rpc();

    // Fetch the account
    const expenseAccount = await program.account.expenseAccount.fetch(
      expenseAccountPda
    );

    // Verify balance is reset
    assert.equal(expenseAccount.balance.toNumber(), 0);
  });

  it("can transfer balance", async () => {
    const transactionNote = "Transfer balance";
    const receiver = anchor.web3.Keypair.generate();
    const transferAmount = new anchor.BN(1000000); // 0.001 SOL

    await provider.connection.requestAirdrop(
      receiver.publicKey,
      transferAmount.toNumber()
    );

    await program.methods
      .transferBalance(transactionNote, transferAmount)
      .accounts({
        owner: wallet.publicKey,
        receiver: receiver.publicKey,
      })
      .rpc();

    const receiverBalance = await provider.connection.getBalance(
      receiver.publicKey
    );
    assert.isAbove(receiverBalance, 0);
  });
});
```


social-media.ts (test script)
```
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SocialMediaProgram } from "../target/types/social_media_program";
import { assert } from "chai";

describe("social-media", () => {
  // Configure the client to use the local cluster
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace
    .SocialMediaProgram as Program<SocialMediaProgram>;
  const [messagePda] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("message"), provider.wallet.publicKey.toBuffer()],
    program.programId
  );

  it("Post a message", async () => {
    // Generate PDA for the message using message count as seed

    const title = "First Message";
    const content = "Hello, Solana!";

    const tx = await program.methods
      .postMessage(title, content)
      .accounts({
        author: provider.wallet.publicKey,
      })
      .rpc();

    console.log("Post message transaction:", tx);

    // Fetch and verify the message
    const message = await program.account.message.fetch(messagePda);
    assert.ok(message.author.equals(provider.wallet.publicKey));
    assert.equal(message.title, title);
    assert.equal(message.content, content);
  });

  it("Edit a message", async () => {
    const newTitle = "Updated Title";
    const newContent = "Updated content!";

    const tx = await program.methods
      .editMessage(newTitle, newContent)
      .accounts({
        author: provider.wallet.publicKey,
      })
      .rpc();

    console.log("Edit message transaction:", tx);

    // Verify the message was updated
    const message = await program.account.message.fetch(messagePda);
    assert.equal(message.title, newTitle);
    assert.equal(message.content, newContent);
  });

  it("Delete a message", async () => {
    const tx = await program.methods
      .deleteMessage()
      .accounts({
        author: provider.wallet.publicKey,
        message: messagePda,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    console.log("Delete message transaction:", tx);

    // Verify the message account was closed
    try {
      await program.account.message.fetch(messagePda);
      assert.fail("Message account should have been closed");
    } catch (e) {
      // Expected error - account not found
      assert.ok(e);
    }
  });
});
```

After pasting the code inside, run

``` poseidon test ```

If all checks have passed, run
``` anchor test --provider.cluster devnet ```

