import { sql } from "../database/database.js";

const getTotalTopics = async () => {
    const result = await sql`SELECT COUNT(*) FROM topics;`;
    return result;
};

const getTotalQuestions = async () => {
    const result = await sql`SELECT COUNT(*) FROM questions;`;
    return result;
};

const getTotalQuestionAnswers = async () => {
    const result = await sql`SELECT COUNT(*) FROM question_answers;`;
    return result;
};

export { getTotalQuestionAnswers, getTotalQuestions, getTotalTopics };
