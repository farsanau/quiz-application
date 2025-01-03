import { assertEquals } from "https://deno.land/std@0.222.1/testing/asserts.ts";

import { registerUser } from "../../../routes/controllers/userController.js";

Deno.test("User registration should fail if passwords do not match", async () => {
    const requestMock = {
        body: () => ({
            value: new Map([
                ["email", "test@example.com"],
                ["password", "password123"],
                ["verification", "password1234"],
            ]),
        }),
    };

    const responseMock = { redirect: () => {} };
    const renderMock = (view, data) => data;

    const result = await registerUser({
        request: requestMock,
        response: responseMock,
        render: renderMock,
    });

    assertEquals(result.errors.verification, "Passwords do not match");
});
