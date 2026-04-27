import React from "react";

const title = {
  1: "HTML Element Cleansing",
  2: "Normalize Text",
  3: "Vader Labeling",
  4: "Data Balancing",
  5: "Sentiment Analysis With Roberta",
};

const getTextExplain = (prepoStep) => {
  switch (prepoStep) {
    case 1:
      return {
        desc: `aims to clean text from unnecessary HTML tags, such as <div>, <br>, or <a> links. When data is extracted from websites, the text often contains these elements which can interfere with the analysis process. By removing them, the system can focus on the original content of the message, making text analysis easier to perform.`,
        note: "",
      };
    case 2:
      return {
        desc: `aims to tidy up the text to make it cleaner and more consistent before analysis. This process includes removing URLs, mentions (@username), hashtags (#tag), non-alphabetic characters except (!) and (?), as well as excessive whitespace. With this normalization, it will be easier for the system to process the message content more accurately.`,
        note: "This stage automatically includes the HTML Cleansing process.",
      };
    case 3:
      return {
        desc: "is used to determine the sentiment of a text, whether it is positive, negative, or neutral. VADER (Valence Aware Dictionary and sEntiment Reasoner) is a lexicon and rule-based sentiment analysis tool that assigns scores based on emotional words in the text. This score is then used to determine the sentiment label.",
        note: "This stage automatically includes the HTML Cleansing and Text Normalization processes.",
      };
    case 4:
      return {
        desc: "is used to balance the amount of data in each sentiment category, such as positive, negative, and neutral. This step is important so the model can understand all three categories proportionally, enabling it to produce accurate analysis for each sentiment label.",
        note: "This stage automatically includes the HTML Cleansing, Text Normalization, and Vader Labeling processes.",
      };
    case 5:
      return {
        desc: "utilizes a pre-trained RoBERTa model to understand general language context, which is then retrained with 37,028 public opinion data points about ChatGPT. With this retraining, the model can classify sentiment more accurately in a more specific context.",
        note: "",
      };
    default:
      return { desc: "", note: "" };
  }
};

const StepperExplain = ({ prepoStep, isStepper = false }) => {
  const description = getTextExplain(prepoStep).desc;
  const note = getTextExplain(prepoStep).note;
  return (
    <>
      <p
        style={{
          fontFamily: "Arial",
          fontSize: "17px",
          lineHeight: "25px",
          color: "#444444 ",
        }}
      >
        <span style={{ fontWeight: "bold", fontStyle: "italic" }}>
          {title[prepoStep]}{" "}
        </span>
        {description}
      </p>
      {note !== "" && !isStepper && (
        <p
          style={{
            fontSize: "17px",
            color: "#444444 ",
          }}
        >
          <span
            style={{
              fontWeight: "bold",
              fontStyle: "italic",
              color: "#444444 ",
            }}
          >
            Note:
          </span>{" "}
          {note}
        </p>
      )}
    </>
  );
};

export default StepperExplain;
