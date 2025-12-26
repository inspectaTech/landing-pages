  /*
  * @notes ### docs @ lib/main/section prefs notes.md
  */

  const default_sections = [
  // "sunzao_sunzao",// always shows for everyone
  // "admin_admin",// always shows for editors
  "library_library",
  "bookmarks_bookmarks",
  "profile_profile",
  "home_home",
  "recent_recent",
  "pin_pin",
  // "activity_activity",
  // "projects_projects"
  ];

  const default_section_data = {
    "sunzao_sunzao":{
      home: false,
      icon: "flame-icon",
      name: "sunzao",
      type: "sunzao",
      owner: true,
      guest: "public"// ignores anything else
    },
    "library_library":{
      home: true,
      icon: "books",
      name: "library",
      type: "library",
      owner: true,
      guest: "published"
    },
    "bookmarks_bookmarks":{
      home: false,
      icon: "bookmark",
      name: "bookmarks",
      type: "bookmarks",
      owner: true,
      guest: "public"
    },
    "profile_profile":{
      home: false,
      icon: "user",
      name: "profile",
      type: "profile",
      owner: true,
      guest: "public"
    },
    "home_home": {
      home: false,
      icon: "home3",
      name: "home",
      type: "home",
      owner: true,
      guest: "public"
    },
    "recent_recent":{
      home: false,
      icon: "clock",
      name: "recent",
      type: "recent",
      owner: true,
      guest: "public"
    },
    "pin_pin":{
      home: false,
      icon: "pushpin",
      name: "pin",
      type: "pin",
      owner: true,
      guest: "published"
    },
    "projects_projects":{
      home: false,
      icon: "users",
      name: "projects",
      type: "projects",
      owner: true,
      guest: "published",
    },
    // "activity_activity":{
    //   home: false,
    //   icon: "doing",
    //   name: "activity",
    //   type: "activity",
    //   owner: true,
    //   guest: "public"
    // }
  };

  const default_prefs = {
    bookmarks: {
        protected:["bookmarks","faith","recommended","community","events",
          "discussions","wishlist","projects", "issues","ideas", "activity"
        ],
        active:"bookmarks",
        bookmarks:{
          icon:"bookmark2",
          data:[]
        }
    },
    "section_views" : [ ...default_sections],
    "section_data": {...default_section_data},
    "section_home" : "library"
  }

  // feature no-fly list - items that appear hear won't be processed by feature section
  const feature_restricted = ["library","profile","sunzao","home"];
  // IMPORTANT recent is currently in QUESTION
  // docs @ lib/main/section prefs notes.md


  module.exports = {
    default_prefs,
    default_sections,
    default_section_data,
    feature_restricted
  }
