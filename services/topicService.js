import { sql } from "../database/database.js";

const getTopics = async () => {
    // Fetch topics from the database (adjust this query to fit your schema)

    return await sql`SELECT * FROM topics ORDER BY name ASC`;
};

const getTopicbyId = async (id) => {
    return await sql`SELECT * FROM topics WHERE id = ${id}`;
};

const addTopic = async (name, userId) => {
    await sql`INSERT INTO topics (name, user_id) VALUES (${name}, ${userId})`;
};

const getTopicByName = async (name) => {
    const result = await sql`SELECT * FROM topics WHERE name =${name}`;
    return result;
};

const deleteTopic = async (topicId) => {
    console.log("inside delete service");
    // Delete answers for the topic's questions
    await sql`DELETE FROM question_answers WHERE question_id IN (SELECT id FROM questions WHERE topic_id = ${topicId})`;

    // Delete answer options for the topic's questions
    await sql`DELETE FROM question_answer_options WHERE question_id IN (SELECT id FROM questions WHERE topic_id = ${topicId})`;

    await sql`DELETE FROM questions WHERE topic_id = ${topicId}`;

    await sql`DELETE FROM topics WHERE id = ${topicId}`;
};

export { addTopic, deleteTopic, getTopicbyId, getTopicByName, getTopics };
