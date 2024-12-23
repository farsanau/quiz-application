import * as questionService from "../../services/questionService.js";
import * as answerService from "../../services/answerService.js";
import * as mainTopics from "../../services/topicService.js";

const showQuestions = async ({ render, params }) => {
    // const user = await state.session.get("user");
    const topicId = params.id;
    const topicbyId = await mainTopics.getTopicbyId(topicId);
    const data = {
        questions: await questionService.showQuestions(topicId),
        topics: topicbyId[0],
        formData: { question_text: "" },
    };
    console.log("data topics----", data.topics);
    return await render("questions.eta", data);
};

const addQuestions = async ({ params, request, response, state, render }) => {
    console.log("inside add questions");
    const topicId = params.id;
    const body = request.body({ type: "form" });
    const formData = await body.value;
    const questionText = formData.get("question_text");
    const errors = [];

    // Validate that question_text is not empty
    if (!questionText || questionText.trim().length < 3) {
        errors.push("The question must contain at least three character.");
    }

    // Get the current user
    const user = await state.session.get("user");

    // If validation fails, re-render the form with errors
    if (errors.length > 0) {
        console.log(errors);
        const questions = await questionService.showQuestions(topicId);
        console.log("***questions", questions);
        const topic = await mainTopics.getTopicbyId(topicId);
        console.log("*****topics", topic);
        const data = {
            topics: topic[0],
            questions: questions,
            topicId: topicId,
            errors: errors,
            formData: { question_text: questionText },
            userId: user ? user.id : null,
        };

        return await render("questions.eta", data);
    }

    // Add the question to the database
    if (user) {
        await questionService.addQuestions(user.id, topicId, questionText);
    }

    // Redirect back to the topic page
    response.redirect(`/topics/${topicId}`);
};

const getRandomQuestion = async ({ response }) => {
    // Get all questions and pick one at random
    const questions = await questionService.getAllQuestions();

    if (questions.length === 0) {
        response.status = 404;
        response.body = {};
        return;
    }

    // Select a random question
    const randomQuestion =
        questions[Math.floor(Math.random() * questions.length)];

    // Get the answer options for this question
    const answerOptions = await answerService.getAnswerOptionsByQuestionId(
        randomQuestion.id,
    );

    // Format the response
    const data = {
        questionId: randomQuestion.id,
        questionText: randomQuestion.question_text,
        answerOptions: answerOptions.map((option) => ({
            optionId: option.id,
            optionText: option.option_text,
        })),
    };

    response.status = 200;
    response.body = data;
};

const checkAnswer = async ({ request, response }) => {
    try {
        if (request.hasBody) {
            const body = request.body({ type: "json" }); // explicitly expect JSON
            const { questionId, optionId } = await body.value;
            console.log("OPTION ID", optionId);
            if (!questionId || !optionId) {
                response.status = 400;
                response.body = { error: "Invalid request body." };
                return;
            }

            const selectedOption = await answerService.getAnswerOptionbyId(
                optionId,
            );
            console.log(
                "Selected option question id",
                selectedOption[0].question_id,
            );

            if (!selectedOption) {
                response.status = 404;
                response.body = { error: "Answer option not found." };
                return;
            }
            if (selectedOption[0].question_id !== questionId) {
                response.status = 400;
                response.body = {
                    error: "Answer option does not match the question.",
                };
                return;
            }

            // Check if the answer is correct
            const isCorrect = selectedOption[0].is_correct;

            // Send the response
            response.status = 200;
            response.body = { correct: isCorrect };
        } else {
            response.status = 400;
            response.body = { error: "No body in request." };
        }
    } catch (err) {
        console.error(err); // Log the error
        response.status = 500;
        response.body = { error: "Internal server error." };
    }
};

export { addQuestions, checkAnswer, getRandomQuestion, showQuestions };
