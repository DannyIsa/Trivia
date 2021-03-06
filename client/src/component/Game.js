import React, { useRef, useEffect, useState } from "react";
import Cookies from "js-cookie";
import PlayerScore from "./PlayerScore";
import "../style/Game.css";
import Network from "../networkWarper";

export default function Game({ history, playerName }) {
  const alreadyAskedSavedQuestion = useRef([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    question: "",
    option_1: "",
    option_2: "",
    option_3: "",
    option_4: "",
  });
  const [userAnswer, setUserAnswer] = useState("");
  const [questionScore, setQuestionScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [mistakeCounter, setMistakeCounter] = useState(0);
  const rateRef = useRef(0);
  const [questionCounter, setQuestionCounter] = useState(1);
  const logOut = () => {
    Network("http://localhost:3000/users/logout", "POST")
      .then((result) => {
        console.log(result);
      })
      .catch((e) => {
        console.log(e);
      });
    Cookies.remove("refreshToken");
    Cookies.remove("accessToken");
    history.push("/");
  };

  useEffect(() => {
    if (mistakeCounter === 3) {
      Network("http://localhost:3000/players", "POST", {
        name: playerName,
        score: totalScore,
      })
        .then((result) => {
          history.push("/TableScore");
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [mistakeCounter]);

  useEffect(async () => {
    try {
      if (questionCounter % 3 === 0) {
        const test = await Network(
          "http://localhost:3000/savedQuestion",
          "GET"
        ); ////////
        if (
          !test.data ||
          alreadyAskedSavedQuestion.current.includes(test.savedQuestionID)
        ) {
          const data = await Network(
            "http://localhost:3000/newQuestion",
            "GET"
          ); /////
          setCurrentQuestion(data);
        } else {
          setCurrentQuestion(test);
        }
      } else {
        const data = await Network("http://localhost:3000/newQuestion", "GET"); ////////
        setCurrentQuestion(data);
      }
    } catch (error) {
      console.log(error, "try & catch");
    }
  }, [questionCounter]);

  useEffect(async () => {
    try {
      const data = await Network("http://localhost:3000/newQuestion", "GET"); ////////
      setCurrentQuestion(data);
    } catch (e) {
      console.log(e, "try & catch");
      history.push("/"); /// unouatorized
    }
  }, []);

  const getOptions = (currentQuestion) => {
    let options = [];
    if (currentQuestion.question_type < 3) {
      for (let i = 0; i < 4; i++) {
        options.push(currentQuestion[`option_${i + 1}`]);
      }
    } else if (currentQuestion.question_type === 3) {
      options = ["true", "false"];
    }
    return options;
  };

  const next = async () => {
    let dbAnswer = "";
    if (currentQuestion.savedQuestions) {
      if (Number(rateRef.current.value)) {
        await Network(
          `http://localhost:3000/rate/${currentQuestion.savedQuestionID}`,
          "POST",
          { rate: Number(rateRef.current.value) }
        ); ////////////////////////////////
      }
      const data = await Network(
        `http://localhost:3000/savedAnswer/${currentQuestion.savedQuestionID}`,
        "GET"
      ); //////////////////////////////
      dbAnswer = data.answer;
      alreadyAskedSavedQuestion.current = [
        ...alreadyAskedSavedQuestion.current,
        currentQuestion.savedQuestionID,
      ];
    } else {
      if (Number(rateRef.current.value)) {
        const data = await Network(
          "http://localhost:3000/savedQuestion",
          "POST", /////////////////////////////////////
          currentQuestion
        );

        alreadyAskedSavedQuestion.current = [
          ...alreadyAskedSavedQuestion.current,
          data.id,
        ];
        await Network(`http://localhost:3000/rate/${data.id}`, "POST", {
          ///////////////////////////////////
          rate: Number(rateRef.current.value),
        });
      }
      const data = await Network(
        "http://localhost:3000/getNewAnswer",
        "POST", ////////////////////////////////////////
        currentQuestion
      );

      dbAnswer = data.answer;
    }
    if (dbAnswer === userAnswer) {
      setQuestionScore(100);
      setTotalScore((totalScore) => totalScore + 100);
    } else {
      setQuestionScore(0);
      setMistakeCounter((mistakeCounter) => ++mistakeCounter);
    }
    rateRef.current.value = 0;
    setQuestionCounter((questionCounter) => ++questionCounter);
    setUserAnswer("");
  };

  return (
    <div className="game-body">
      <div>
        <button onClick={logOut}>logout</button>
      </div>
      <h1 className="question-counter">Question number- {questionCounter}</h1>
      <div id="rating">
        <span>rate this question: </span>
        <span className="custom-select">
          <select onChange={() => {}} id="select" ref={rateRef}>
            <option value={0}></option>
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
          </select>
        </span>
      </div>

      <div className="question-box">
        <div id="question">{currentQuestion.question}</div>
        <div id="options-container">
          {getOptions(currentQuestion).map((option) => {
            return (
              <div
                className="option"
                onClick={() => {
                  setUserAnswer(option);
                }}
              >
                {option}
              </div>
            );
          })}
        </div>
        <button
          id="send-button"
          onClick={() => {
            try {
              next();
            } catch (e) {
              console.log(e, "try & catch");
            }
          }}
        >
          send
        </button>
        <div id="user-choise">your choice is: {userAnswer}</div>
        <div className="player-score">
          <PlayerScore questionScore={questionScore} totalScore={totalScore} />
        </div>
      </div>
      <div id="game-life">
        You got {mistakeCounter === 0 ? 3 : mistakeCounter === 1 ? 2 : 1}
        {mistakeCounter === 2 ? " life" : " lifes"} left
      </div>
    </div>
  );
}
