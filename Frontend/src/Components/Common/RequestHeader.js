export function RequestHeader() {
  let user = localStorage.getItem("v-chat-token");
  if (user && user?.token) {
    return {
      Authorization: "Bearer " + user.token,
      Accept: "application/json",
      "Content-Type": "application/json",
    };
  } else {
    return {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
  }
}
