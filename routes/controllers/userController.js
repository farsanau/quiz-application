import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";
import * as userService from "../../services/userService.js";
import {
    isEmail,
    minLength,
    required,
    validate,
} from "https://deno.land/x/validasaur@v0.15.0/mod.ts";

const registerUser = async ({ request, response, render }) => {
    const body = request.body({ type: "form" });
    const params = await body.value;

    const email = params.get("email");
    const verification = params.get("verification");
    const password = params.get("password");

    // Define validation rules
    const validationRules = {
        email: [required, isEmail],
        password: [required, minLength(4)],
    };

    // Apply validation
    const [passes, errors] = await validate(
        { email, password },
        validationRules,
    );

    // If validation fails
    // If validation fails
    if (!passes || password !== verification) {
        const data = {
            errors: {
                ...(errors?.email ? { email: "Invalid email" } : {}),
                ...(errors?.password
                    ? { password: "Password must be at least 4 characters" }
                    : {}),
                ...(password !== verification
                    ? { verification: "Passwords do not match" }
                    : {}),
            },
            email, // Populate form with entered email
        };

        // Render the registration form with validation errors
        return await render("register.eta", data);
    }

    // If validation passes, hash the password and register the user
    const hashedPassword = await bcrypt.hash(password);
    await userService.addUser(email, hashedPassword);

    response.redirect("/auth/login");
};

const showRegister = ({ render }) => {
    const data = {
        email: "",
    };
    render("register.eta", data);
};

export { registerUser, showRegister };
