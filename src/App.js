import React from "react";
import { getRandomWord } from "./utils.js";
import "./App.css";


class App extends React.Component {
  constructor(props) {
    // Always call super with props in constructor to initialise parent class
    super(props);
    const currWord = props.word.toLowerCase() ?? getRandomWord();
    const currLetters = new Set(currWord.split(""));
    this.state = {
      currWord: currWord,
      currLetters: currLetters,
      guessedLetters: [],
      numGuesses: Math.max(props.numGuesses, currLetters.size) ?? 10,
      playerMessage: "",
      hasWon: false,
      hasLost: false,
      numRounds: 0,
      numRoundsWon: 0,
      input: "",
    };
  }

  generateWordDisplay = () => {
    const wordDisplay = [];
    // for...of is a string and array iterator that does not use index
    for (let letter of this.state.currWord) {
      if (this.state.guessedLetters.includes(letter)) {
        wordDisplay.push(letter);
      } else {
        wordDisplay.push("_");
      }
    }
    return wordDisplay.toString();
  };

  handleChange = (e) => {
    this.setState({ input: e.target.value });
  };

  handleSubmit = (e) => {
    // prevent browser from reloading the page
    e.preventDefault();

    // check terminal states
    if (this.state.hasWon) {
      this.setState({
        playerMessage: `You've already won, try again?`
      });
      return;
    }

    if (this.state.hasLost) {
      this.setState({
        playerMessage: `You've already lost, try again?`
      });
      return;
    };

    // process input
    let letterInput = this.state.input.slice().toLowerCase();
    // note that we've limited max length to 1 character

    // do nothing if input is not a letter
    if (letterInput.length === 0 || !letterInput.match(/[a-z]/i)) return;

    if (this.state.guessedLetters.includes(letterInput)) {
      this.setState({
        playerMessage: `You've already guessed the letter "${letterInput}"!`
      });
    } else {

      const newGuessedLetters = [...this.state.guessedLetters, letterInput];

      // check win condition
      const intersection = new Set([...newGuessedLetters].filter(x => this.state.currLetters.has(x)));
      const newHasWon = this.state.currLetters.size === intersection.size;

      // check loss condition
      const newHasLost = !newHasWon && newGuessedLetters.length >= this.state.numGuesses;

      // formulate message
      let newPlayerMessage;
      if (!newHasWon && !newHasLost) {
        newPlayerMessage = "";  // game continues
      } else if (newHasWon && !newHasLost) {
        newPlayerMessage = "You've won, yay! Try again?";
      } else if (!newHasWon && newHasLost) {
        newPlayerMessage = "You've run out of guesses, boo... Try again?";
      }

      // update state
      this.setState({
        guessedLetters: newGuessedLetters,
        playerMessage: newPlayerMessage,
        hasWon: newHasWon,
        hasLost: newHasLost,
        numRounds: newHasWon || newHasLost ? this.state.numRounds + 1 : this.state.numRounds,
        numRoundsWon: newHasWon ? this.state.numRoundsWon + 1 : this.state.numRoundsWon,
      });
    }

  };

  resetGame = () => {
    const newWord = getRandomWord();
    const newLetters = new Set(newWord.split(""));
    this.setState({
      currWord: newWord,
      currLetters: newLetters,
      guessedLetters: [],
      numGuesses: Math.max(this.state.numGuesses, newLetters.size),
      playerMessage: "",
      hasWon: false,
      hasLost: false,
    });
  };

  render() {

    const replayButton = <button onClick={this.resetGame}>Play again</button>;

    return (
      <div className="App">
        <header className="App-header">
          <h1>Guess The Word 🚀</h1>
          <h3>Wins: {this.state.numRoundsWon} of {this.state.numRounds} rounds</h3>
          <h3>Word Display</h3>
          {this.generateWordDisplay()}
          <h3>Guessed Letters</h3>
          {this.state.guessedLetters.length > 0
            ? this.state.guessedLetters.toString()
            : "-"}
          <p>
            Number of guesses left: {
              this.state.numGuesses - this.state.guessedLetters.length
            }
          </p>
          <h3>Input</h3>
          <form onSubmit={this.handleSubmit}>
            <label>
              Provide one letter:
              <br />
              <input
                name="letterInput"
                value={this.state.input}
                type="text"
                maxLength={1}
                disabled={this.state.hasWon || this.state.hasLost}
                onChange={this.handleChange}
              />
            </label>
            <input
              type="submit"
              value="Submit"
              disabled={this.state.hasWon || this.state.hasLost}
            />
            <br />
            {this.state.playerMessage}
            <br />
            {(this.state.hasWon || this.state.hasLost) && replayButton}
          </form>
        </header>
      </div>
    );
  }
}

export default App;
