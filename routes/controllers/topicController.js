import * as mainTopics from "../../services/topicService.js";

const showTopics = async ({ render, state }) => {
    console.log("inside show topics");
    const user = await state.session.get("user");
    console.log("********user", user);
    const data = {
        topics: await mainTopics.getTopics(),
        isAdmin: user && user.admin,
        errors: [],
        formData: { name: "" }, // Empty form initially
    };
    console.log("*********data tpoics", data.topics);

    return await render("topics.eta", data);
};

const addTopic = async ({ request, response, render, state }) => {
    console.log("inside add topics");
    const body = request.body({ type: "form" });
    const params = await body.value;
    const name = params.get("name");
    const user = await state.session.get("user");
    const errors = [];

    if (!name || name.trim().length < 4) {
        errors.push("Topic name must contain at least four character.");
        console.log(errors);
    }

    if (errors.length > 0) {
        const data = {
            topics: await mainTopics.getTopics(),
            isAdmin: true,
            errors,
            formData: { name },
        };

        return await render("topics.eta", data);
    }

    const existingTopic = await mainTopics.getTopicByName(name);

    if (existingTopic.length > 0) {
        errors.push("Topic already exists!");
        const data = {
            topics: await mainTopics.getTopics(),
            isAdmin: true,
            errors,
            formData: { name },
        };
        return await render("topics.eta", data);
    }

    await mainTopics.addTopic(name, user.id);

    response.redirect("/topics");
};

const deleteTopic = async ({ params, response }) => {
    const topicId = params.id;
    console.log(topicId);
    await mainTopics.deleteTopic(topicId);

    response.redirect("/topics");
};

export { addTopic, deleteTopic, showTopics };
