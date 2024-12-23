import * as userService from "../../services/userService.js";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";

const processLogin = async ({ request, response, state, render }) => {
    const body = request.body({ type: "form" });
    const params = await body.value;

    const email = params.get("email");
    const password = params.get("password");

    // Basic validation for email and password fields
    if (!email || !password) {
        const data = {
            error: "Both email and password are required.",
            email, // Pre-fill the email field for convenience
        };
        await render("login.eta", data);
        return;
    }

    const userFromDatabase = await userService.findUserByEmail(email);

    // If no user found or more than one found
    if (userFromDatabase.length !== 1) {
        const data = {
            error: "Invalid email or password.",
            email,
        };
        await render("login.eta", data);
        return;
    }

    const user = userFromDatabase[0];
    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
        const data = {
            error: "Invalid email or password.",
            email,
        };
        await render("login.eta", data);
        return;
    }

    // Set the user in the session and redirect to /topics
    await state.session.set("user", user);
    response.redirect("/topics");
};

// Function to show the login form
const showLoginForm = ({ render }) => {
    const data = {
        error: [], // Initially, no error
    };
    render("login.eta", data);
};

export { processLogin, showLoginForm };
