import { defineStore } from "pinia";
const SMP_KEY = import.meta.env.VITE_SMP_ACCESS_KEY;

export const useAuthStore = defineStore("auth", {
  id: "auth",
  state: () => ({
    accessToken: "",
    loggedIn: true,
    user_ID: 0,
    role: 0,
    name: "",
  }),
  persist: true,
  actions: {
    async Login(uid, password, sso) {
      let info = {};
      if (sso) {
        console.log("login with sso");
        const urlParams = new URLSearchParams(window.location.search);
        const authorizationCode = urlParams.get("code");
        console.log(authorizationCode);

        const res = await fetch("api/user/smplogin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ authCode: authorizationCode }),
        });

        const rollNumber = await res.json();
        uid = rollNumber.rollNumber;
        console.log("roll number :", rollNumber);
        console.log("SMP KEY :", SMP_KEY);
        info = {
          user_ID: rollNumber.rollNumber,
          password: SMP_KEY,
        };
      } else {
        console.log("normal login");

        info = {
          user_ID: uid,
          password: password,
        };
      }

      console.log("sending login request with info :", info);
      console.log("url", "api/user/login");
      const res = await fetch("api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(info),
      });

      if (res.status == 200) {
        const data = await res.json();
        console.log("data :", data);
        this.accessToken = data["accessToken"];
        console.log("access token: " + this.accessToken);
        this.loggedIn = true;
        this.user_ID = uid;
        this.name = data["name"];
        this.role = data["role"];
        console.log("logged in as :", this.loggedIn);
        console.log("user id :", this.user_ID);
        console.log("role :", this.role);
        console.log("name :", this.name);
        window.location.href = "/";
      } else {
        console.log("logging out from login");
        await this.Logout();
      }
    },
    async Refresh() {
      console.log("We entered the refresh function in auth.js");
      const res = await fetch("api/user/refresh", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.status == 200) {
        const data = await res.json();
        this.accessToken = data["accessToken"];
        console.log("new access token: " + this.accessToken);
        this.loggedIn = true;
        this.user_ID = data["user_ID"];
        this.role = data["role"];
        this.name = data["name"];
      } else {
        this.loggedIn = false;
      }
      return res;
    },
    async Logout() {
      console.log("logging out");
      const res = await fetch("api/user/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.status == 200) {
        console.log("logged out");
        this.accessToken = "";
        this.loggedIn = false;
      } else {
        console.log("error logging out");
        this.accessToken = "";
        this.loggedIn = false;
        console.log("logged in as :", this.loggedIn);
      }
    },
  },
});
