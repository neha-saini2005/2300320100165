import axios from "axios";
const CLIENT_ID = "4f1cdd6f-e368-4772-8385-dffbb52c0d9f";
const CLIENT_SECRET = "jXGtzEnHqpqzPdSU";
const LOG_URL = "http://4.224.186.213/evaluation-service/logs";
const AUTH_URL = "http://4.224.186.213/evaluation-service/auth";
let token = "";
async function getToken() {
    const response = await axios.post(AUTH_URL, {
        clientID: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
    });
    token = response.data.access_token;
}
export async function Log(stack, level, package_name, message) {
    if (!token) {
        await getToken();
    }
    try {
        await axios.post(LOG_URL, { stack, level, package: package_name, message }, { headers: { Authorization: `Bearer ${token}` } });
    }
    catch (error) {
        console.error("Logging failed:", error);
    }
}
//# sourceMappingURL=logger.js.map