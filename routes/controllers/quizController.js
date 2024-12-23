import * as mainTopics from "../../services/topicService.js";
import * as questionService from "../../services/questionService.js";
import * as answerService from "../../services/answerService.js";

const showQuizTopics = async ({ render, state }) => {
    const user = await state.session.get("user");

    const data = {
        topics: await mainTopics.getTopics(),
        isAdmin: user && user.admin,
        errors: [],
        formData: { name: "" }, // Empty form initially
    };

    return await render("quiz.eta", data);
};

const getRandomQuestionForQuiz = async ({ params, response, render }) => {
    const topicId = params.tId;

    const questions = await questionService.showQuestions(topicId);

    if (questions.length === 0) {
        // Render a message informing that there are no questions for this topic
        const data = {
            topicId,
            message: "There are no questions for this topic yet.",
        };
        await render("noQuestion.eta", data); // Make sure you have a `noQuestions.eta` template
        return;
    }

    // Randomly select one question from the list of questions
    const randomQuestion =
        questions[Math.floor(Math.random() * questions.length)];

    // Redirect the user to the selected question page
    response.redirect(`/quiz/${topicId}/questions/${randomQuestion.id}`);
};

const getQuizQuestion = async ({ params, render }) => {
    const qId = params.qId;
    const topicId = params.tId;

    const quizQuestion = await questionService.getQuestionById(qId);
    const answerOptions = await answerService
        .getAnswerOptionsByQuestionId(qId);

    const data = {
        quizQuestion: quizQuestion[0],
        answerOptions,
        topicId,
        qId,
    };

    await render("quizQuestion.eta", data);
};

const processAnswerSelection = async ({ params, response, state }) => {
    const questionId = params.qId;
    const optionId = params.oId;
    const topicId = params.tId;
    const userId = await state.session.get("user").id;

    const selectedOption = await answerService.getAnswerOptionbyId(optionId);
    console.log("SELECTED OPTION HERE", selectedOption);
    const isCorrect = selectedOption[0].is_correct;

    await answerService.saveUserAnswer(userId, questionId, optionId);

    console.log(isCorrect);

    if (isCorrect) {
        response.redirect(`/quiz/${topicId}/questions/${questionId}/correct`);
    } else {
        response.redirect(`/quiz/${topicId}/questions/${questionId}/incorrect`);
    }
};
const showCorrectPage = ({ params, render }) => {
    const { tId: topicId, qId: questionId } = params;

    const data = {
        topicId,
        questionId,
    };

    render("correct.eta", data); // Render the correct page
};

const showIncorrectPage = async ({ params, render }) => {
    const { tId: topicId, qId: questionId } = params;

    // Get the correct answer text from the query string (or use state/session if needed)
    const correctOption = await answerService.getCorrectOptionByQuestionId(
        questionId,
    );
    console.log("correct option", correctOption);

    const data = {
        topicId,
        questionId,
        correctOption: correctOption[0],
    };

    render("incorrect.eta", data);
};

export {
    getQuizQuestion,
    getRandomQuestionForQuiz,
    processAnswerSelection,
    showCorrectPage,
    showIncorrectPage,
    showQuizTopics,
};
