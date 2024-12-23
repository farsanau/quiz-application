import { Router } from "../deps.js";
import * as mainController from "./controllers/mainController.js";
import * as topicController from "./controllers/topicController.js";
import * as userController from "./controllers/userController.js";
import * as loginController from "./controllers/loginController.js";
import * as questionController from "./controllers/questionController.js";
import * as answerController from "./controllers/answerController.js";
import * as quizController from "./controllers/quizController.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";

const router = new Router();

router.get("/", mainController.showMain);
router.get("/topics", topicController.showTopics);
router.post("/topics", adminMiddleware, topicController.addTopic);
router.post("/topics/:id/delete", adminMiddleware, topicController.deleteTopic);
router.get("/topics/:id", questionController.showQuestions);
router.post("/topics/:id/questions", questionController.addQuestions);
router.get("/topics/:id/questions/:qId", answerController.showAnswerOptions);
router.post(
    "/topics/:id/questions/:qId/options",
    answerController.addAnswerOptions,
);
router.post(
    "/topics/:tId/questions/:qId/options/:oId/delete",
    answerController.deleteAnswerOptions,
);
router.post(
    "/topics/:tId/questions/:qId/delete",
    answerController.deleteQuestion,
);

router.get("/quiz", quizController.showQuizTopics);
router.get("/quiz/:tId", quizController.getRandomQuestionForQuiz);
router.get("/quiz/:tId/questions/:qId", quizController.getQuizQuestion);
router.post(
    "/quiz/:tId/questions/:qId/options/:oId",
    quizController.processAnswerSelection,
);

router.get("/quiz/:tId/questions/:qId/correct", quizController.showCorrectPage);
router.get(
    "/quiz/:tId/questions/:qId/incorrect",
    quizController.showIncorrectPage,
);

router.get("/auth/register", userController.showRegister);
router.post("/auth/register", userController.registerUser);

router.get("/auth/login", loginController.showLoginForm);
router.post("/auth/login", loginController.processLogin);

router.get("/api/questions/random", questionController.getRandomQuestion);
router.post("/api/questions/answer", questionController.checkAnswer);

export { router };
