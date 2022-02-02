const USERNAME_DEFAULT = "octocat";
const TEXT_NOT_AVAILABLE = "Not Available";
const TEXT_BIOGRAPHY_DEFAULT = "This profile has no bio";

const DARK_THEME_NAME = "dark";
const LIGHT_THEME_NAME = "light";
const PREFERS_COLOR_SCHEME_DARK = "(prefers-color-scheme: dark)";


new Vue({
  el: "#app",

  data: {
    constants: {
      TEXT_BIOGRAPHY_DEFAULT,
      TEXT_NOT_AVAILABLE,
    },
    colorTheme: {
      active: LIGHT_THEME_NAME,
      next: DARK_THEME_NAME,
    },
    search: "",
    isSearchError: false,
    searchResult: null,
  },

  methods: {
    toggleTheme: function() {
      [this.colorTheme.active, this.colorTheme.next] = [this.colorTheme.next, this.colorTheme.active]
    },

    submit: async function(event) {
      event?.preventDefault();
      try {
        let resp = await fetch(`https://api.github.com/users/${this.search || USERNAME_DEFAULT}`);
        if (resp.status !== 200) throw new Error("Fail fetch");
        resp = await resp.json();
        this.searchResult = resp;
        this.isSearchError = false;
      } catch (error) {
        this.isSearchError = true;
      }
    },
  },
  computed: {
    user: function() {
      if (!this.searchResult) return null;
      const data = this.searchResult;
      const joinedA = new Date(data["created_at"]).toDateString().slice(4).split(" ");
      return {
        avatar: data["avatar_url"],
        username: data["login"],
        name: data["name"] || `${data["login"]}@`,
        joined: `Joined ${[joinedA[1], joinedA[0], joinedA[2]].join(" ")}`,
        biography: data["bio"],
        repos: data["public_repos"],
        followers: data["followers"],
        following: data["following"],
        location: data["location"],
        website: data["blog"],
        twitter: data["twitter_username"],
        company: data["company"],
      };
    }
  },

  created: function() {
    this.submit();
    if (window.matchMedia(PREFERS_COLOR_SCHEME_DARK).matches) this.toggleTheme();
  },
});
