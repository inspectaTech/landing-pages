

[mongoose schematypes arrays](https://mongoosejs.com/docs/schematypes.html#arrays)
Note: specifying an empty array is equivalent to Mixed. The following all create arrays of Mixed:
```
const Empty1 = new Schema({ any: [] });
const Empty2 = new Schema({ any: Array });
const Empty3 = new Schema({ any: [Schema.Types.Mixed] });
const Empty4 = new Schema({ any: [{}] });
```

#### item chat_data strucure

```
  chat_data: {
    chat_ref: "inherit",
    chat_ref_id: null,
    video_ref: "inherit",
    video_ref_id: null,
  }
```

#### item links

```
  links:{
    data:{
      1637986110898:{
        description: "Get inspired on a campus made to help you pursue your passion.\n\n- 110+ studios and collaborative production environments\n- Professional-level recordin",
        id: "1637986110898",
        image: "https://i.ytimg.com/vi/CpkFfO4ttQ0/mqdefault.jpg",
        link: "https://youtu.be/CpkFfO4ttQ0",
        note: {},
        title: "Tour the Full Sail Campus",
        type: "link",
        variant: "meta",
      },
      1641483518085:{
        description: "Brilliant - Build quantitative skills in math, science, and computer science with hands-on interactive lessons.",
        id: "1641483518085",
        image: "https://brilliant.org/site_media/version-a36afe2dd2/images/open-graph/logged-out-home-pix-v2.png",
        link: "https://brilliant.org/",
        title: "Brilliant | Learn interactively",
      },
      1642457154483:{
        active_desc: true,
        active_title: false,
        clip_id: "61ec1fcf75e45078f3b78c03",
        clip_ids: Array(2)
          0: "61ec1fcf75e45078f3b78c03"
          1: "5e2d883a6be8ab12f02ed94c"
        description: "",
        id: "1642457154483",
        image: "",
        link: "",
        note: {},
        spacers: {auto_spacer: true, title: {…}, description: {…}, content: {…}},
        template: "LookOut",
        title: "Test title",
        type: "clip",
      },
    },
    ids:[
      "1637986110898"
      "1641355876894"
    ],
  }
```

> NOTE: preset_data.links also carries identical data as item.links above   
> 