import React from "react";

const getTextExplain = (prepoStep) => {
  switch (prepoStep) {
    case 1:
      return {
        desc: `aims to clean the text from unnecessary HTML tags, such as <div>, <br>, or <a> links. When data is extracted from websites, the text often contains these elements which can interfere with the analysis process. By cleaning them, the system can focus on the original message content, making text analysis easier to perform.`,
        note: "",
      };
    case 2:
      return {
        desc: `aims to tidy up the text to make it cleaner and more consistent before analysis. This process includes the removal of URLs, mentions (@username), hashtags (#tag), non-alphabetic characters except (!) and (?), as well as excessive spaces. This normalization will make it easier for the system to process the message content more accurately.`,
        note: "This stage already includes the HTML Cleansing process automatically.",
      };
    case 3:
      return {
        desc: "is used to determine the sentiment of a text, whether it is positive, negative, or neutral. VADER (Valence Aware Dictionary and sEntiment Reasoner) is a lexicon and rule-based sentiment analysis tool that provides a score based on emotional words in the text. This score is then used to determine the sentiment label.",
        note: "This stage already includes the HTML Cleansing and Text Normalization processes automatically.",
      };
    case 4:
      return {
        desc: "utilizes a pre-trained RoBERTa model to understand the general language context, and is then retrained with 37,028 public opinion data regarding ChatGPT. With this retraining, the model can classify sentiment more accurately in a more specific context.",
        note: "",
      };
    case 5:
      return {
        desc: "is used to balance the amount of data in each sentiment category, such as positive, negative, and neutral. This step is important so the model can understand all three categories proportionally, enabling it to produce accurate analysis for each sentiment label.",
        note: "This stage already includes the HTML Cleansing, Text Normalization, and VADER Labeling processes automatically.",
      };
    default:
      return "";
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
            Note :
          </span>{" "}
          {note}
        </p>
      )}
    </>
  );
};

export default StepperExplain;
