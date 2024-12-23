const adminMiddleware = async (context, next) => {
    const user = await context.state.session.get("user");

    if (user && user.admin) {
        await next(); // user is admin, continue
    } else {
        context.response.status = 403; // forbidden
        context.response.body = "Access Denied: Admins Only";
    }
};

export { adminMiddleware };
