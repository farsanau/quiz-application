import { sql } from "../database/database.js";

const showAnswerOptions = async (qId) => {
    return await sql`SELECT * FROM question_answer_options WHERE question_id=${qId}`;
};

const addAnswerOptions = async (questionId, option_text, is_correct) => {
    await sql`INSERT INTO question_answer_options (question_id, option_text, is_correct) VALUES (${questionId}, ${option_text}, ${is_correct})`;
};

const deleteAnswer = async (oId) => {
    await sql`DELETE FROM question_answers WHERE question_answer_option_id =${oId}`;
    await sql`DELETE FROM question_answer_options WHERE id = ${oId}`;
};

const getAnswerOptionsByQuestionId = async (questionId) => {
    console.log("inside getAnswer option query");
    const result =
        await sql`SELECT * FROM question_answer_options WHERE question_id = ${questionId}`;

    return result;
};

const getAnswerOptionbyId = async (oId) => {
    console.log("option id", oId);
    return await sql`SELECT * FROM question_answer_options WHERE id=${oId}`;
};

const getCorrectOptionByQuestionId = async (questionId) => {
    return await sql` SELECT option_text 
    FROM question_answer_options 
    WHERE question_id = ${questionId} AND is_correct = true;`;
};

const saveUserAnswer = async (userId, questionId, optionId) => {
    await sql` INSERT INTO question_answers (user_id, question_id, question_answer_option_id)
    VALUES (${userId}, ${questionId}, ${optionId})`;
};

export {
    addAnswerOptions,
    deleteAnswer,
    getAnswerOptionbyId,
    getAnswerOptionsByQuestionId,
    getCorrectOptionByQuestionId,
    saveUserAnswer,
    showAnswerOptions,
};
