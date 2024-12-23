import { sql } from "../database/database.js";

const showQuestions = async (topicId) => {
    return await sql`SELECT * FROM questions WHERE topic_id = ${topicId} `;
};

const getQuestionById = async (questionId) => {
    return await sql`SELECT * FROM questions WHERE id=${questionId}`;
};

const addQuestions = async (userId, topicId, questionText) => {
    await sql`
            INSERT INTO questions (user_id, topic_id, question_text)
            VALUES (${userId}, ${topicId}, ${questionText})
        `;
};

const deleteQuestion = async (qId) => {
    await sql`DELETE FROM questions WHERE id = ${qId}`;
};

const getAllQuestions = async () => {
    return await sql`SELECT * FROM questions`;
};

export {
    addQuestions,
    deleteQuestion,
    getAllQuestions,
    getQuestionById,
    showQuestions,
};
