import * as staticService from "../../services/statisticService.js";
const showMain = async ({ render }) => {
    console.log("inside statistics fn");
    const totalTopics = await staticService.getTotalTopics();
    console.log("get total topics,", totalTopics);
    const totalQuestions = await staticService.getTotalQuestions();
    const totalQuestionAnswers = await staticService.getTotalQuestionAnswers();

    render("main.eta", {
        totalTopics: totalTopics[0],
        totalQuestions: totalQuestions[0],
        totalQuestionAnswers: totalQuestionAnswers[0],
    });
};

export { showMain };
