const allowCORS = async ({ response }, next) => {
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");

    // For preflight requests (OPTIONS method)
    if (response.method === "OPTIONS") {
        response.status = 204; // No Content
        return;
    }

    await next();
};

export { allowCORS };
