import React from "react";
import "./App.scss";

// components
import SubmitButton from "./components/SubmitButton";
import UrlInput from "./components/UrlInput";

function App() {
  return (
    <div id="app">
      <UrlInput
        renderButton={(showShortenUrlButton, userInput, handleResetForm) => (
          <SubmitButton
            showShortenUrlButton={showShortenUrlButton}
            handleShortenUrl={() => {}}
            handleShowOriginalUrl={() => {}}
          />
        )}
      />
    </div>
  );
}

export default App;
