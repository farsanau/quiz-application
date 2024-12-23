import * as questionService from "../../services/questionService.js";
import * as answerService from "../../services/answerService.js";

const showAnswerOptions = async ({ render, params }) => {
    const questionId = params.qId;
    const topicId = params.id;
    const question = await questionService.getQuestionById(questionId);
    const data = {
        question: question[0],
        questionId,
        topicId,
        errors: [],
        answerOptions: await answerService.showAnswerOptions(questionId),
        formData: { option_text: "", is_correct: false },
    };
    await render("answerOptions.eta", data);
};

const addAnswerOptions = async (
    { request, render, params, response },
) => {
    console.log("inside add answer options");
    const topicId = params.id;
    const questionId = params.qId;

    const body = request.body({ type: "form" });
    const formData = await body.value;

    const optionText = formData.get("option_text");
    const is_correct = formData.get("is_correct") === "on";

    const errors = [];

    if (!optionText || optionText.trim().length < 3) {
        errors.push("The answer option must contain at least three character.");
    }

    if (errors.length > 0) {
        const question = await questionService.getQuestionById(questionId);

        const data = {
            answerOptions: await answerService.showAnswerOptions(questionId),
            question: question[0],
            errors: errors,
            topicId,
            questionId,
            formData: { option_text: optionText, is_correct },
        };
        return await render("answerOptions.eta", data);
    } else {
        await answerService.addAnswerOptions(
            questionId,
            optionText,
            is_correct,
        );
        response.redirect(`/topics/${topicId}/questions/${questionId}`);
    }
};

const deleteAnswerOptions = async ({ params, response }) => {
    const oId = params.oId;
    const tId = params.tId;
    const qId = params.qId;

    await answerService.deleteAnswer(oId);

    response.redirect(`/topics/${tId}/questions/${qId}`);
};
const deleteQuestion = async ({ params, response }) => {
    const qId = params.qId;
    const tId = params.tId;
    await questionService.deleteQuestion(qId);

    response.redirect(`/topics/${tId}`);
};

export {
    addAnswerOptions,
    deleteAnswerOptions,
    deleteQuestion,
    showAnswerOptions,
};
