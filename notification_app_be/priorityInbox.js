import axios from "axios";
const AUTH_URL = "http://4.224.186.213/evaluation-service/auth";
const NOTIF_URL = "http://4.224.186.213/evaluation-service/notifications";
const CLIENT_ID = "4f1cdd6f-e368-4772-8385-dffbb52c0d9f";
const CLIENT_SECRET = "jXGtzEnHqpqzPdSU";
const WEIGHT = {
    Placement: 3,
    Result: 2,
    Event: 1,
};
async function getToken() {
    const res = await axios.post(AUTH_URL, {
        clientID: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        email: "nehasaini9612@gmail.com",
        name: "neha saini",
        rollNo: "2300320100165",
        accessCode: "cXuqht",
    });
    return res.data.access_token;
}
async function getNotifications(token) {
    const res = await axios.get(NOTIF_URL, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.notifications;
}
function getPriorityScore(notification) {
    const weight = WEIGHT[notification.Type] || 0;
    const time = new Date(notification.Timestamp).getTime();
    return weight * 1e13 + time;
}
async function main() {
    const token = await getToken();
    const notifications = await getNotifications(token);
    const sorted = notifications.sort((a, b) => getPriorityScore(b) - getPriorityScore(a));
    const top10 = sorted.slice(0, 10);
    console.log("Top 10 Priority Notifications:");
    console.log(JSON.stringify(top10, null, 2));
}
main();
//# sourceMappingURL=priorityInbox.js.map